import {Gtk} from 'astal/gtk3'
import AstalHyprland from 'gi://AstalHyprland'
import GLib from 'gi://GLib'
import {bind, execAsync} from '../../../../../../../../../usr/share/astal/gjs'

const HyprlandService = AstalHyprland.get_default()

const workspaces = new Map([
    ['files', 1],
    ['wbrowser', 2],
    ['dev', 3],
    ['term', 4],
    ['design', 5],
    ['office', 6],
    ['it', 7],
    ['misc', 8],
    ['add1', 9],
    ['add2', 10],
])

const WorkspaceItem = (name: string, id: number) => {
    const focusedWorkspace = bind(HyprlandService, 'focusedWorkspace')
    const clients = bind(HyprlandService, 'clients')

    return (
        <button
            className="workspace_item"
            onClick={() => {
                execAsync([
                    'bash',
                    '-c',
                    `${GLib.getenv('HOME')}/.scripts/hypr/workspace toworkspace ${id}`,
                ])
            }}
            setup={(self) => {
                self.toggleClassName(
                    'occupied',
                    clients.get().filter((client) => client.workspace.id === id)
                        .length > 0,
                )
                self.toggleClassName(
                    'focused',
                    focusedWorkspace.get().id === id,
                )

                self.hook(focusedWorkspace, (self) => {
                    self.toggleClassName(
                        'focused',
                        focusedWorkspace.get().id === id,
                    )
                })
                self.hook(clients, (self) => {
                    self.toggleClassName(
                        'occupied',
                        clients
                            .get()
                            .filter((client) => client.workspace.id === id)
                            .length > 0,
                    )
                })
            }}
        >
            {id}
        </button>
    )
}

const Workspace = () => {
    const workspaceItems = []

    for (const [name, id] of workspaces.entries()) {
        workspaceItems.push(WorkspaceItem(name, id))
    }

    return (
        <box className="workspace" valign={Gtk.Align.CENTER}>
            {workspaceItems}
        </box>
    )
}

export default Workspace
