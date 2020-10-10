import { Directive, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appRemoveEmoji]'
})
export class RemoveEmojiDirective {

  constructor() { }

  @Input('script') param:  any;

    ngOnInit() {
        let node = document.createElement('script');
        node.src = 'assets/removeEmoji.js';
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
    }

}
