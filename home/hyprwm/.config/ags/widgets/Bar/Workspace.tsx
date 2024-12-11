import {Gtk} from 'astal/gtk3'
import AstalHyprland from 'gi://AstalHyprland'
import GLib from 'gi://GLib'
import {bind, execAsync} from '../../../../../../../../../usr/share/astal/gjs'

const HyprlandService = AstalHyprland.get_default()

const workspaces = new Map([
    ['files', 1],
    ['dev', 2],
    ['wbrowser', 3],
    ['term', 4],
    ['design', 5],
    ['office', 6],
    ['it', 7],
    ['misc', 8],
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
                    `${GLib.getenv('HOME')}/.scripts/hypr_workspace toworkspace ${id}`,
                ])
            }}
            setup={(self) => {
                self.toggleClassName(
                    'focused',
                    focusedWorkspace.get().name.trim() === name,
                )
                self.toggleClassName(
                    'occupied',
                    clients
                        .get()
                        .filter(
                            (client: AstalHyprland.Client) =>
                                client.workspace.name.trim() === name,
                        ).length > 0,
                )
                self.hook(focusedWorkspace, (self, workspace) => {
                    self.toggleClassName(
                        'focused',
                        workspace.name.trim() === name,
                    )
                })
                self.hook(clients, (self, clients) => {
                    const clientsWorkspace = clients.filter(
                        (client: AstalHyprland.Client) =>
                            client.workspace.name.trim() === name,
                    )
                    self.toggleClassName(
                        'occupied',
                        clientsWorkspace.length > 0,
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
