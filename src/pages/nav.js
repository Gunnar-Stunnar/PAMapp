import DeviceMenu from './deviceMenu';
import SelectedDevices from './selectDevices';
import Home from './home';
import History from './history';


export  let pages = {
    'HOME':"home",
    'SELECTED_DEVICES':"selectedDevices",
    'DEVICE_MENU':"deviceMenu",
    'HISTORY':"history"
}

export  let pages_obj_references = {
    "home": Home,
    "selectedDevices": SelectedDevices,
    "deviceMenu": DeviceMenu,
    "history": History
}