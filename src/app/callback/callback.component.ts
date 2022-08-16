// Copyright 2018 Ping Identity
//
// Licensed under the MIT License (the "License"); you may not use this file
// except in compliance with the License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RedirectRequestHandler } from '@openid/appauth';


import { Router } from '@angular/router';
import { AuthorizationService } from 'src/app/authorization.service';
import { UserInfo } from 'src/app/userinfo';


@Component({
    selector: 'app-callback',
    templateUrl: './callback.component.html',
    styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements AfterViewInit,OnInit {
userDetails:any;
userid:any;
    constructor(public authorizationService: AuthorizationService, public router: Router) { }


    ngOnInit()
    {
        console.log('into callback component');
    }

    ngAfterViewInit() {
        if (!window.location.hash || window.location.hash.length === 0) {
            const queryString = window.location.search.substring(1); // substring strips '?'
            const path = [window.location.pathname, queryString].join('#');
            window.location.assign(new URL(path, window.location.href).toString());
        } else if (new URLSearchParams(window.location.hash.substring(1)).has('code')) {
            this.authorizationService.completeAuthorizationRequest().then((tokenResponse) => {
                console.log('recieved token response: ' + tokenResponse);
    //             this.userid=window.localStorage.getItem('LS_USER_INFO');
    //   console.log(this.userid);
                //this.router.navigate(['/tag']);
                this.authorizationService.userInfos().subscribe((userInfo:UserInfo|null)=>{
                    if(userInfo)
                    {
                        this.userDetails = userInfo.sub;
    // this.userDetails['attributes'] = { "EMAIL_VERIFIED": ["true"], "EMAIL": [userInfo['Email']], "LAST_NAME": [""], "NUID": [userInfo['sub']], "FIRST_NAME": ["Test"] };
    localStorage.setItem('userDetails',this.userDetails);
    this.router.navigate(['/page']);
                    }
                });
                
            });
        } else {
            console.log('did not recognize callback in URL fragment or query');
            this.router.navigate(['/dauAgreement']);
        }
    }
}
