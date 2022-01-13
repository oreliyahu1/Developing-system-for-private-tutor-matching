import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent as StudentRegisterComponent } from './student/register.component';
import { RegisterComponent as TutorRegisterComponent } from './tutor/register.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Register'
    },
    children: [
      {
        path: '',
        redirectTo: 'student'
      },
      {
        path: 'student',
        component: StudentRegisterComponent,
        data: {
          title: 'Student'
        }
      },
      {
        path: 'tutor',
        component: TutorRegisterComponent,
        data: {
          title: 'Tutor'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterBaseRoutingModule {}
