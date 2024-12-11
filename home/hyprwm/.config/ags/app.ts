import {App} from 'astal/gtk3'
import style from './style.scss'
import Bar from './widgets/Bar/Main'
import SystemTray from './widgets/SystemTray/Main'
import Menu from './widgets/Menu/Main'
import Dashboard from './widgets/Dashboard/Main'
import Notification from './widgets/Notification/Main'
import Dialog from './widgets/Menu/Dialog'
import QuickControl from './widgets/QuickControl/Main'
import NetworkControl from './widgets/QuickControl/Network'
import BluetoothControl from './widgets/QuickControl/Bluetooth'

App.start({
    css: style,
    instanceName: 'astal',
    main() {
        Bar()
        SystemTray()
        Menu()
        Dashboard()
        Notification()
        Dialog()
        QuickControl()
        NetworkControl()
        BluetoothControl()
    },
})
