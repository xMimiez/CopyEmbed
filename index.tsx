/*
 * Copy Embed
 * Copyright (c) 2026 Mime
 * SPDX-License-Identifier: MIT
 */

import { findGroupChildrenByChildId, NavContextMenuPatchCallback } from "@api/ContextMenu";
import { copyWithToast } from "@utils/discord";
import definePlugin, { IconComponent } from "@utils/types";
import { Embed, Message } from "@vencord/discord-types";
import { ComponentType } from "@vencord/discord-types/enums";
import { Menu } from "@webpack/common";

const CopyrightIcon: IconComponent = ({ height = 20, width = 20, className }) => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width={width}
            height={height}
            className={className}
        >
            <path
                fill="currentColor"
                d="M11.88 9.14c1.28.06 1.61 1.15 1.63 1.66h1.79c-.08-1.98-1.49-3.19-3.45-3.19C9.64 7.61 8 9 8 12.14c0 1.94.93 4.24 3.84 4.24 2.22 0 3.41-1.65 3.44-2.95h-1.79c-.03.59-.45 1.38-1.63 1.44-1.31-.04-1.86-1.06-1.86-2.73 0-2.04 1.17-2.96 1.88-3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            />
        </svg>
    );
};

interface ComponentNode {
    type?: number;
    components?: ComponentNode[];
}

function embedsOf(message: Message): Embed[] {
    if (message.embeds.length > 0) return message.embeds;
    return message.messageSnapshots?.flatMap(snapshot => snapshot.message.embeds) ?? [];
}

function componentsOf(message: Message): ComponentNode[] {
    const own = message.components as ComponentNode[] | undefined;
    if (own?.length) return own;
    return message.messageSnapshots?.flatMap(snapshot => (snapshot.message.components as ComponentNode[] | undefined) ?? []) ?? [];
}

function containersIn(nodes: ComponentNode[] | undefined, found: ComponentNode[] = []) {
    if (!nodes) return found;

    for (const node of nodes) {
        if (!node) continue;
        if (node.type === ComponentType.CONTAINER) found.push(node);
        else containersIn(node.components, found);
    }

    return found;
}

function embedJson(embeds: Embed[], containers: ComponentNode[]) {
    const value = containers.length === 0
        ? embeds.length === 1 ? embeds[0] : embeds
        : embeds.length === 0
            ? containers.length === 1 ? containers[0] : containers
            : { embeds, components: containers };

    return JSON.stringify(value, (_key, item) => {
        if (typeof item === "function" || typeof item === "bigint") return undefined;
        if (item instanceof Date) return item.toISOString();
        return item;
    }, 2);
}

const messageContextMenuPatch: NavContextMenuPatchCallback = (children, { message }: { message?: Message; }) => {
    if (!message) return;

    const embeds = embedsOf(message);
    const containers = containersIn(componentsOf(message));
    if (embeds.length === 0 && containers.length === 0) return;

    const item = (
        <Menu.MenuItem
            id="vc-copy-embed"
            label="Copy Embed"
            icon={CopyrightIcon}
            leadingAccessory={{ type: "icon", icon: CopyrightIcon }}
            action={() => {
                const count = embeds.length + containers.length;
                copyWithToast(embedJson(embeds, containers), count === 1 ? "Embed copied to clipboard!" : "Embeds copied to clipboard!");
            }}
        />
    );

    const group = findGroupChildrenByChildId("copy-text", children);
    if (group) {
        const index = group.findIndex(child => child?.props?.id === "copy-text");
        group.splice(index + 1, 0, item);
        return;
    }

    children.push(<Menu.MenuGroup>{item}</Menu.MenuGroup>);
};

export default definePlugin({
    name: "Copy Embed",
    description: "Adds a Copy Embed option to the message right-click menu and the hover menu when that message has an embed or a Components V2 container.",
    authors: [
        {
            name: "Mime",
            id: 957164619061932045n
        }
    ],
    enabledByDefault: true,
    contextMenus: {
        message: messageContextMenuPatch,
        "message-actions": messageContextMenuPatch
    }
});
