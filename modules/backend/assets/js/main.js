/**
 * October CMS Backend Entry Point
 *
 * This is the main entry point for the backend panel. It imports all
 * required scripts, and relies on system/main.js being loaded first
 * for global dependencies like jQuery, Vue, Bootstrap, etc.
 */

// Vue Application
import './vueapp/vue-application.js';
import './vueapp/vue-control-base.js';

// October Core
import './october/october.lang.js';
import './october/october.alert.js';
import './october/october.snackbar.js';
import './october/october.scrollpad.js';
import './october/october.sidenav.js';
import './october/october.scrollbar.js';
import './october/october.filelist.js';
import './october/october.layout.js';
import './october/october.sidepaneltab.js';
import './october/october.simplelist.js';
import './october/october.treelist.js';
import './october/october.sidenav-tree.js';
import './october/october.datetime.js';
import './october/october.responsivemenu.js';
import './october/october.mainmenu.js';
import './october/october.modalfocusmanager.js';
import './october/october.domidmanager.js';
import './october/october.vueutils.js';
import './october/october.tooltip.js';
import './october/october.jsmodule.js';
import './october/october.flyout.js';
import './october/october.tabformexpandcontrols.js';

// Settings nav control
import './controls/settings-nav.js';

// Backend core
import './backend/backend.js';
import './backend/backend.ajax.js';
import './backend/backend.fixes.js';
