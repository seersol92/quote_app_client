import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ElementRef } from '@angular/core';
import { AuthService } from './../services/auth.service';
import { LoggedInService } from './../services/logged-in.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Message } from './../entites/message';
import { ChatService } from './../services/chat.service';


@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.component.html',
  styleUrls: ['./../custom.scss']
})
export class ChatAppComponent implements OnInit, OnDestroy {
  public chatPanel = false;
  messageList: Array<Message>;
  userList: Array<any>;
  showActive: boolean;
  showInbox: Boolean = false;
  sendForm: FormGroup;
  username: string;
  chatWith: string = null;
  currentOnline: boolean;
  receiveMessageObs: any;
  receiveActiveObs: any;
  noMsg: boolean;
  conversationId: string;
  notify: boolean;
  notification: any = {timeout: null};

  constructor(
    public loggedSer: LoggedInService,
    private router: Router,
    private _flashMessagesService: FlashMessagesService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private authService: AuthService,
    private auth: AuthService,
    private chatService: ChatService
  ) {
    this.sendForm = this.formBuilder.group({
      message: ['', Validators.required ]
    });
     this.authService.getProfile().subscribe(profile => {
     if (profile.user) {
      this.authService.loggedinName = profile.user.username ;
      this.authService.isAdmin = profile.user.is_admin;
     }
    });
  }
  ngOnInit() {
    const  userData = this.authService.getUserData();
    this.username = userData.user.username;
    this.sendForm = this.formBuilder.group({
      message: ['', Validators.required ]
    });
    this.getUserList();
    this.connectToChat();
  }

  ngOnDestroy() {
    this.receiveActiveObs.unsubscribe();
    this.receiveMessageObs.unsubscribe();
  }

  connectToChat(): void {
  const  connected = this.chatService.isConnected();
  if (connected === true) {
    this.initReceivers();
  } else {
    this.chatService.connect(this.username, () => {
      this.initReceivers();
    });
  }
}
  getUserList(): void {
    this.chatService.getUserList()
      .subscribe(data => {
        if (data.success === true) {
          const users = data.data;
          for (let i = 0; i < users.length; i++) {
            if (users[i].username === this.username) {
              users.splice(i, 1);
              break;
            }
          }
          this.userList = users.sort(this.compareByUsername);

          this.receiveActiveObs = this.chatService.receiveActiveList()
            .subscribe(users => {
              for (const onlineUsr of users) {
                if (onlineUsr.username !== this.username) {
                  let flaggy = 0;
                  for (const registered of this.userList) {
                    if (registered.username === onlineUsr.username) {
                      flaggy = 1;
                      break;
                    }
                  }
                  if (flaggy === 0) {
                    this.userList.push(onlineUsr);
                    this.userList.sort(this.compareByUsername);
                  }
                }
              }

              for (const user of this.userList) {
                let flag = 0;
                for (const liveUser of users) {
                  if (liveUser.username === user.username) {
                    user.online = true;
                    flag = 1;
                    break;
                  }
                }
                if (flag === 0) {
                  user.online = false;
                }
              }

              this.currentOnline = this.checkOnline(this.chatWith);
            });

          this.chatService.getActiveList();
        } else {
          this.onNewConv('chat-room');
        }
      });
  }

  initReceivers(): void {
    this.getUserList();

    this.receiveMessageObs = this.chatService.receiveMessage()
      .subscribe(message => {
        this.checkMine(message);
        if (message.conversationId === this.conversationId) {
          this.noMsg = false;
          this.messageList.push(message);
          this.scrollToBottom();
          this.msgSound();
        } else if (message.mine !== true) {
          if (this.notification.timeout) { clearTimeout(this.notification.timeout); }
          this.notification = {
            from: message.from,
            inChatRoom: message.inChatRoom,
            text: message.text,
            timeout: setTimeout(() => { this.notify = false; }, 4000)
          };
          this.notify = true;
          this.notifSound();
        }
      });
  }

  onSendSubmit(): void {
    const newMessage: Message = {
      created: new Date(),
      from: this.username,
      text: this.sendForm.value.message,
      conversationId: this.conversationId,
      inChatRoom: this.chatWith === 'chat-room'
    };
    this.chatService.sendMessage(newMessage, this.chatWith);
    newMessage.mine = true;
    this.noMsg = false;
    this.messageList.push(newMessage);
    this.scrollToBottom();
    this.msgSound();
    this.sendForm.setValue({message: ''});
    // this.initReceivers();
  }

  logMeOut() {
    this.authService.logout();
    // flash message will be visible for 2 second
    this._flashMessagesService.show('You are logged out', { cssClass: 'alert-success', timeout: 2000 });
    this.router.navigate(['/login']);
  }

  checkOnline(name: string): boolean {
    if (name === 'chat-room') {
      for (const user of this.userList) {
        if (user.online === true) {
          return true;
        }
      }
      return false;
    } else {
      for (const user of this.userList) {
        if (user.username === name) {
          return user.online;
        }
      }
    }
  }
  onNewConv(username: string) {
    this.showInbox = true;
    this.getMessages(username);
    this.chatWith = username;
    this.currentOnline = this.checkOnline(username);
    this.showActive = false;
  }

  checkMine(message: Message): void {
    if (message.from === this.username) {
      message.mine = true;
    }
  }

  onUsersClick(): void {
    this.showActive = !this.showActive;
  }

  notifSound(): void {
    const sound: any = this.el.nativeElement.querySelector('#notifSound');
    sound.play();
  }

  msgSound(): void {
    const sound: any = this.el.nativeElement.querySelector('#msgSound');
    sound.load();
    sound.play();
  }

  scrollToBottom(): void {
    const element: any = this.el.nativeElement.querySelector('.msg-container');
    setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    }, 100);
  }

  getMessages(name: string): void {
    this.chatService.getConversation(this.username, name)
      .subscribe(data => {
        if (data.success === true) {
          this.conversationId = data.conversation._id || data.conversation._doc._id;
          const messages = data.conversation.messages || null;
          if (messages && messages.length > 0) {
            for (const message of messages) {
              this.checkMine(message);
            }
            this.noMsg = false;
            this.messageList = messages;
            this.scrollToBottom();
          } else {
            this.noMsg = true;
            this.messageList = [];
          }
        } else {
          this.onNewConv('chat-room');
        }
      });
  }

  compareByUsername(a, b): number {
    if (a.username < b.username) {
       return -1;
    }
    if (a.username > b.username) {
       return 1;
    }
    return 0;
  }

}
