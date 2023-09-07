import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])

    
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilService: UtilsService,

  ) { }

  ngOnInit() {

    this.confirmPassword();
  }

  confirmPassword(){

    this.form.controls.confirmPassword.setValidators([
      Validators.required,
      CustomValidators.matchValues(this.form.controls.password)
    ])

    this.form.controls.confirmPassword.updateValueAndValidity();
  }

  submit(){

    if(this.form.valid){

      console.log(this.form.value);
      this.utilService.presentLoading({ message: "Registrando..."});
      this.firebaseService.signUp(this.form.value as User).then( async res =>{

        await this.firebaseService.updateUser({displayName: this.form.value.name});  

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
