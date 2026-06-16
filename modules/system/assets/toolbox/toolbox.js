import { registerControl } from 'larajax';
import ContextMenu from './controls/context-menu/context-menu.js';
import LoaderContainerControl from './controls/loader-container/loader-container-control.js';
import SearchInputControl from './controls/search-input/search-input-control.js';
import CustomSelectControl from './controls/custom-select/custom-select-control.js';
import TabControl from './controls/tab/tab-control.js';
import DatePickerControl from './controls/datepicker/datepicker.js';
import InputPresetEngine from './controls/input-preset/input-preset-engine.js';
import InputPreset from './controls/input-preset/input-preset.js';
import InputHotkeyControl from './controls/input-hotkey/hotkey-control.js';
import InputTriggerControl from './controls/input-trigger/input-trigger-control.js';
import ChangeMonitorControl from './controls/change-monitor/change-monitor-control.js';
import DragScrollControl from './controls/drag-scroll/drag-scroll-control.js';
import './controls/drag-scroll/drag-scroll-plugin.js';
import ToolbarControl from './controls/toolbar/toolbar-control.js';
import RowLinkControl from './controls/rowlink/rowlink-control.js';
import CheckboxControl from './controls/checkbox/checkbox-control.js';
import CheckboxRange from './controls/checkbox/checkbox-range.js';
import './controls/popover/popover-control.js';
import './controls/dropdown/dropdown.js';

// Instances
oc.ContextMenu = ContextMenu;
oc.InputPresetEngine = new InputPresetEngine;
oc.InputPreset = InputPreset;
oc.changeMonitor = ChangeMonitorControl;
oc.CheckboxRange = new CheckboxRange;
oc.checkboxRangeRegisterClick = (ev, containerSelector, checkboxSelector) => oc.CheckboxRange.registerClick(ev, containerSelector, checkboxSelector);

// Controls
registerControl('loader-container', LoaderContainerControl);
registerControl('search-input', SearchInputControl);
registerControl('custom-select', CustomSelectControl);
registerControl('tab', TabControl);
registerControl('datepicker', DatePickerControl);
registerControl('drag-scroll', DragScrollControl);
registerControl('toolbar', ToolbarControl);
registerControl('rowlink', RowLinkControl);
registerControl('checkbox', CheckboxControl);

// Scripts
registerControl('input-hotkey', InputHotkeyControl);
registerControl('input-trigger', InputTriggerControl);
registerControl('change-monitor', ChangeMonitorControl);
