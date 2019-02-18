import { PanelCtrl } from 'grafana/app/plugins/sdk'; 
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver/theme.min';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/table';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';

import './css/panel.base.scss';

class HtmlDocCtrl extends PanelCtrl {
  constructor($scope, $injector) {
    super($scope, $injector);
    const panelDefaults = {
      userHtml: '<p>Documentation</p>',
      editor: null,
    };
    
    _.defaults(this.panel, panelDefaults);
    
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('refresh', this.onRefresh.bind(this));
    this.events.on('render', this.onRefresh.bind(this));
    
    //$scope.$watch(
    //  'ctrl.panel.userHtml',
    //  _.throttle(() => {
    //    this.render();
    //  }, 1000)
    //);
  }
  
  onInitEditMode() {
    this.addEditorTab('Contents', `${this.panelPath}/partials/editor-html.html`);
  }
  
  onRefresh() {
    let content = (this.panel.editor) ? this.panel.editor.getContent() : this.panel.userHtml;
    this.panel.userHtml = content;
    $('#html-doc-panel').html(content);
  }
  
  doShowTinyMce(selector) {
    var self = this;
    if (self.panel.editor) {
      tinymce.remove();
      self.panel.editor = null;
    }
    tinymce.init({
      selector: selector,
      inline: true,
      plugins: 'link paste advlist anchor autolink fullscreen image imagetools table searchreplace visualblocks',
      toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist advlist outdent indent | table | fullscreen | image imagetools',
      skin_url: `${this.panelPath}lib/tinymce/skins/ui/oxide-dark`,
      setup: function (editor) {
        editor.on('init', function (e) {
          self.panel.editor = e.target;
          self.panel.editor.setContent(self.panel.userHtml);
        });
      }
    });
    
    return true;
  }

  initStyles() {
    window.System.import(this.panelPath + 'css/panel.base.css!');
  }

  get panelPath() {
    if (this._panelPath === undefined) {
      this._panelPath = `/public/plugins/${this.pluginId}/`;
    }
    return this._panelPath;
  }
  
  link(scope, elem, attrs, ctrl) {
    this.initStyles();
  }
}

HtmlDocCtrl.templateUrl = 'partials/main.html';
  

export { HtmlDocCtrl as PanelCtrl }
