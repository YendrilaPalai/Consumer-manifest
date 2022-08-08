import { Component } from '@angular/core';
import { AuthorizationService } from './authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'consumer-manifest';
  constructor(private authSvc:AuthorizationService)
  {

  }
  ngOnInit() {
    let isAuthorized = sessionStorage.getItem('authUser');
if(isAuthorized!='yes' )
{
    this.authSvc.authorize();
}
      
  }
}
