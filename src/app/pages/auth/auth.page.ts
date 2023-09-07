import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
    
  });


  constructor(
    private firebaseService: FirebaseService,
    private utilService: UtilsService,
  ) { }

  ngOnInit() {
  }

  submit(){

    if(this.form.valid){

      this.utilService.presentLoading({ message: "Autenticando..."});
      this.firebaseService.login(this.form.value as User).then( async res =>{

        let user: User = {
          id: res.user.uid,
          name: res.user.displayName,
          email: res.user.email
        }

        this.utilService.setElementInLocalStorage('user', user);
        this.utilService.routerLink('/tabs/home');

        this.utilService.dismissLoading();

        this.utilService.presentToast({
          message: "Bienvenido " + user.name,
          duration: 3000,
          color: "primary",
          icon: "person-outline"
        });

        this.form.reset();

      }, error => {

        this.utilService.dismissLoading();

        this.utilService.presentToast({
          message: error,
          duration: 5000,
          color: "warning",
          icon: "alert-circle-outline"
        });

        console.log(error);

      });

    }
  }
  

}
