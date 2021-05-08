import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { StartupService } from '@core';
import { SettingsService } from '@delon/theme';
declare var jQuery: any;
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  constructor(private settingService: SettingsService, private startupService: StartupService) {
    const app = {
      name: 'Vân Anh PC - Laptop Gaming, Pc Gaming',
      description: 'Vân Anh PC - Laptop Gaming, Pc Gaming',
      year: 2021,
      type: 'HOME',
    };
    this.settingService.setApp(app);
    this.startupService.load();
  }
  ngAfterViewInit(): void {
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[2];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.setAttribute('src', 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js');
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  ngOnInit(): void {}
}
