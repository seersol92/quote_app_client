import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

import { Message } from './../../entites/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit {
  @Input() message: Message;
  time: string;
  fadeTime: boolean;

  constructor() { }

  ngOnInit() {
    setTimeout(()=> {this.updateFromNow(); this.fadeTime = true}, 2000);
    setInterval(()=> {this.updateFromNow()}, 60000);
  }

  updateFromNow(): void {
    this.time = moment(this.message.created).fromNow();
    console.log(this.time);
  }

}