import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.less'],
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  urlComment = '';
  constructor(private route: ActivatedRoute) {
    this.urlComment = 'http://localhost:4200/product-detail/' + this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {}
  ngAfterViewInit() {
    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[2];
      // for (let index = 0; index < fjs.length; index++) {
      //   console.log(index + ' ' + fjs[index].outerHTML);
      // }
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.setAttribute('src', 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v10.0&appId=253504385800401&autoLogAppEvents=1');
      // js.src = '//connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v10.0&appId=253504385800401&autoLogAppEvents=1';
      // Notice the "!" at the end of line
      fjs.nodeName; // <- error!

      if (fjs === null) {
        alert('oops');
      } else {
        // since you've done the nullable check
        // TS won't complain from this point on
        fjs.parentNode?.insertBefore(js, fjs); // <- no error
      }
    })(document, 'script', 'facebook-js-sdk');
  }
}
