import { registerControl } from 'larajax';
import ContextMenu from './controls/context-menu/context-menu.js';
import LoaderContainerControl from './controls/loader-container/loader-container-control.js';
import SearchInputControl from './controls/search-input/search-input-control.js';
import CustomSelectControl from './controls/custom-select/custom-select-control.js';
import TabControl from './controls/tab/tab-control.js';
import DatePickerControl from './controls/datepicker/datepicker.js';
import InputPresetEngine from './controls/input/input-preset-engine.js';
import InputPreset from './controls/input/input-preset.js';
import InputHotkeyControl from './controls/input/input-hotkey-control.js';
import InputTriggerControl from './controls/input/input-trigger-control.js';
import ChangeMonitorControl from './controls/input/change-monitor-control.js';

// Instances
oc.ContextMenu = ContextMenu;
oc.InputPresetEngine = new InputPresetEngine;
oc.InputPreset = InputPreset;
oc.changeMonitor = ChangeMonitorControl;

// Controls
registerControl('loader-container', LoaderContainerControl);
registerControl('search-input', SearchInputControl);
registerControl('custom-select', CustomSelectControl);
registerControl('tab', TabControl);
registerControl('datepicker', DatePickerControl);

// Scripts
registerControl('input-hotkey', InputHotkeyControl);
registerControl('input-trigger', InputTriggerControl);
registerControl('change-monitor', ChangeMonitorControl);
