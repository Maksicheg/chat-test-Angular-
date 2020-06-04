import { UsersService } from './../../shared/services/users.service';
import { IUser } from './../../shared/interfaces/IUser';
import { Component, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('scroll') private messagesContainer: ElementRef;
  currentUser: IUser;
  subscription: Subscription = new Subscription();

  constructor(private usersService: UsersService) {
    if (this.usersService.currentUser === undefined) {
      this.currentUser = this.usersService.getUsersArray()[0];
    }
    this.subscription = usersService.currentUserChange.subscribe(value => {
      this.currentUser = value;
    });
  }

  sendMessage(event: Event): void {
    const message = (event.target as HTMLInputElement).value;
    if (message.trim()) {
      this.usersService.addMessage(this.currentUser.id, message);
      (event.target as HTMLInputElement).value = '';
    }
  }

  scrollToBottom(): void {
    this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
