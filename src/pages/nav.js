import DeviceMenu from './deviceMenu';
import SelectedDevices from './selectDevices';
import Home from './home';


export  let pages = {
    'HOME':"home",
    'SELECTED_DEVICES':"selectedDevices",
    'DEVICE_MENU':"deviceMenu"
}

export  let pages_obj_references = {
    "home": Home,
    "selectedDevices": SelectedDevices,
    "deviceMenu": DeviceMenu
}