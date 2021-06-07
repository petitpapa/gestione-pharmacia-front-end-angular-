import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {SidebarRow} from '../../../core/models/sidebar.row';

@Component({
  selector: 'app-sidebar-row',
  templateUrl: './sidebar-row.component.html',
  styleUrls: ['./sidebar-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarRowComponent implements OnInit {
  svg: SafeHtml;
  @Input() public row: SidebarRow;

  isOpen: boolean;

  parentId: number;

  isSameAndHasContent: boolean;

  constructor(private sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit(): void {
    this.svg = this.sanitizer.bypassSecurityTrustHtml(this.row.svg);
    if (this.row.menus.length > 0) {
      this.parentId = this.row.menus[0].sidebarId;
      this.isSameAndHasContent = true;
      this.isSameAndHasContent &&= this.parentId === this.row.id;
    }
  }
  goTo(menus: any) {
    if (menus.url !== null)
      this.router.navigate([menus.url]);
  }

  onClickOpen() {
    this.isOpen = !this.isOpen;
  }


}
