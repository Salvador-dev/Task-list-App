import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Item, Task } from 'src/app/models/task.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemReorderEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-add-update-task',
  templateUrl: './add-update-task.component.html',
  styleUrls: ['./add-update-task.component.scss'],
})
export class AddUpdateTaskComponent  implements OnInit {

  @Input() task: Task;
  user = {} as User;

  form: any = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    items: new FormControl([], [Validators.required, Validators.minLength(1)])

  })

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {

    this.user = this.utilsService.GetElementFromLocalStorage('user');

    if(this.task){

      this.form.setValue(this.task);
      this.form.updateValueAndValidity();

    }

  }

  submit(){

    if(this.form.valid){
      if(this.task){
        console.log("updating")
        this.updateTask();
      } else {
        this.createTask();
      }
    }
  }

  createTask(){
    let path =`users/${this.user.id}`;
 
    this.utilsService.presentLoading();

    delete this.form.value.id;

    this.firebaseService.addToSubcollection(path, 'tasks', this.form.value).then((res)=> {
      this.utilsService.dismissModal({success: true});

      this.utilsService.presentToast({
        message: 'Tarea creada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      });

      this.utilsService.dismissLoading();

    }, error => {

      this.utilsService.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      });

    })
  }

  updateTask(){
    let path =`users/${this.user.id}/tasks/${this.task.id}`;
 
    this.utilsService.presentLoading();

    delete this.form.value.id;

    this.firebaseService.updateDocument(path, this.form.value).then((res)=> {
      this.utilsService.dismissModal({success: true});

      this.utilsService.presentToast({
        message: 'Tarea actualizada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      });

      this.utilsService.dismissLoading();

    }, error => {

      this.utilsService.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      });

    })
  }

  getPercentage(){

    return this.utilsService.getPercentage(this.form.value as Task);

  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {

    this.form.value.items = ev.detail.complete(this.form.value.items);
    this.form.updateValueAndValidity();

  }

  removeItem(index: number){

    this.form.value.items.splice(index, 1);
    this.form.controls.items.updateValueAndValidity();

  }

  createItem(){
    this.utilsService.presentAlert({
      header: 'Nueva Actividad',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'textarea',
          placeholder: 'Hacer algo...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
      
        }, {
          text: 'Agregar',
          handler: (res) => {

            if(res.name.length < 3) {

              this.utilsService.presentToast({
                message: 'La actividad está vacia',
                color: 'warning',
                icon: 'alert-circle-outline',
                duration: 5000
              });

            } else {

              let item: Item = {name: res.name, completed: false};
              this.form.value.items.push(item);
              this.form.controls.items.updateValueAndValidity();

            } 

          }
        }
      ]

    })
  }

}
