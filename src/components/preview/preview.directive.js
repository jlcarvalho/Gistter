/**
 * Created by JeanLucas on 17/03/2015.
 */
'use strict';
/*jshint esnext: true */

class PreviewDirective {
  constructor () {
    this.template = '<div ng-id="{{id}}" class="preview"><iframe></iframe><div class="drag-cover"></div></div>';
    this.restrict = 'E';
    this.replace = true;
    this.scope = {
      id: '@',
      content: '='
    };
  }

  link (scope, element) {
    scope.$watch('content', (c) => {
      if(angular.isDefined(scope.id))
      {
        sessionStorage.html = c.html || '';
        sessionStorage.css = c.css || '';
        sessionStorage.js = c.js || '';

        var print = `
                      <style>${sessionStorage.css}</style>
                      ${sessionStorage.html}
                      <script>${sessionStorage.js}</script>
                     `;

        angular.element(element).find('iframe').contents().find('body').html(print);
      }
    }, true)
  }

  static directiveFactory() {
    PreviewDirective.instance = new PreviewDirective();
    return PreviewDirective.instance;
  }
}

export default PreviewDirective;
