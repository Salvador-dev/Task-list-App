import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user = {} as User

  constructor(
    private firebaseService: FirebaseService,
    private utilService: UtilsService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){

    this.getUser()

  }

  signOut(){
    this.firebaseService.signOut();

  }

  getUser(){

    return this.user = this.utilService.GetElementFromLocalStorage('user');

  }

  async presentAlertConfirm() {
    this.utilService.presentAlert({
      header: 'Cerrar sesión',
      message: 'Quieres cerrar sesión?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
      
        }, {
          text: 'Si',
          handler: () => {
            this.firebaseService.signOut();

          }
        }
      ]
    });

  }

}
