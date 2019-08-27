import { Component, OnInit } from '@angular/core';
import { UserService } from './../../shared/sharedservices/user.service';
import { AdminService } from './../../shared/sharedservices/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './monitor.component.html',
	providers: [ UserService, AdminService ]
})
export class MonitorComponent implements OnInit {

	numUsers: number
	ous: any[]
	usersTemp: any[]
	users: any[]
	loading: boolean
	identity: any;


  constructor(private user:UserService, public adminService: AdminService) {
		this.loading = true;
		this.numUsers = 0;
		this.ous = [];
		this.users = [];
		this.identity = this.user.getidentity();
	}

  ngOnInit() {
		this.getSessions();
  }

	getSessions() {
		this.adminService.getSessions().subscribe(data => {
			//console.log(data)
			if(data.numUsers && data.numUsers > 0){
				this.numUsers = data.numUsers;
			}
			let ous = JSON.parse(JSON.stringify(data.ous));
			this.usersTemp = Array.from(data.users);
			let i=0;
			for(var key in ous) {
				if(ous.hasOwnProperty(key)) {
					this.ous.push({
						ou: key,
						number: ous[key]
					});
				}
			}
			this.ous.sort((a,b) => (a.ou > b.ou) ? 1 : -1);
			this.usersTemp.forEach(user => {
				this.users[i] = {
					email: user.split(':')[0],
					ou: user.split(':')[1].toUpperCase()
				}
				i++;
			});
			this.users.sort((a,b) => (a.ou > b.ou) ? 1 : (a.ou === b.ou) ? ((a.email > b.email) ? 1 : -1) : -1);
			this.loading = false;
		});
	}
}
