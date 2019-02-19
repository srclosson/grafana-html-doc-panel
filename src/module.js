import { PanelCtrl } from 'grafana/app/plugins/sdk'; 
import tinymce from 'tinymce/tinymce.min';
import 'tinymce/themes/silver/theme.min';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/imagetools';
import 'tinymce/plugins/table';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';

import './css/panel.base.scss';

class HtmlDocCtrl extends PanelCtrl {
  constructor($scope, $injector, templateSrv, $sce) {
    super($scope, $injector);
    this.templateSrv = templateSrv;
    this.$sce = $sce;
    
    const panelDefaults = {
      content: ""
    };
    
    _.defaults(this.panel, panelDefaults);
    
    this.events.on('refresh', this.onRefresh.bind(this));
    this.events.on('render', this.onRender.bind(this));
  }
  
  
  onRefresh() {
    this.render();
  }

  onRender() {
    if (this.panel.isEditing && tinymce.editors.length == 0) {
      tinymce.init({
        target: this.container[0],
        inline: true,
        relative_urls: false,
        plugins: 'link paste lists advlist anchor autolink fullscreen image imagetools table searchreplace visualblocks',
        toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | bullist numlist outdent indent | table | fullscreen | image imagetools',
        menubar: false,
        skin_url: `${this.panelPath}lib/tinymce/skins/ui/oxide-dark`
      });
      
      return;
    }
    
    if (tinymce.editors.length > 0) {
      let content = tinymce.editors[0].getContent(); 
      // Only update the panel if there is something new to update. 
      // Length of 0 is not valid.
      if (content.length > 0) {
        this.panel.content = content;
      }
      if (!this.panel.isEditing) tinymce.remove();
    }
    
    console.log("content", this.panel.content);
    this.container.html(this.panel.content);
    
    this.renderingCompleted();
  }
  
  doShow() {
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
    ctrl.elem = elem;
    ctrl.container = elem.find('#html-doc-panel');
  }
}

HtmlDocCtrl.templateUrl = 'partials/main.html';
  

export { HtmlDocCtrl as PanelCtrl }
