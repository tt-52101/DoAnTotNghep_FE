import { Component, OnInit } from '@angular/core';
import { StartupService } from '@core';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
})
export class LayoutComponent implements OnInit {
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
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  ngOnInit(): void {}
}
