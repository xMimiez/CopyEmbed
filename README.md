<p align="center">
  <img src="assets/icon.svg" alt="Copy Embed" width="112" />
</p>

<div align="center">

# Copy Embed

Copies the embed JSON from a Discord message.

[![Equicord](https://img.shields.io/badge/Equicord-user%20plugin-5865F2?style=flat-square)](https://github.com/Equicord/Equicord)
[![License](https://img.shields.io/badge/license-MIT-227c57?style=flat-square)](./LICENSE)

</div>

## About

Copy Embed is an Equicord user plugin. It adds **Copy Embed** to the message right-click menu and to the menu that opens when you hover a message. The action is shown only when that message has a classic embed or a Components V2 container.

The menu item uses the copyright icon. Choosing it copies that message's embed JSON to the clipboard.

## Features

- Add **Copy Embed** to the message right-click menu.
- Add the same action to the hover menu.
- Hide the action when the message has no embed.
- Copy one classic embed as a JSON object, and several as a JSON array.
- Copy a Components V2 container, including its text, media, and accent color.
- Include an embed stored on a forwarded message.

## Requirements

- [Equicord](https://github.com/Equicord/Equicord), or another Vencord build that loads `src/userplugins`
- Discord desktop

## Installation

1. Clone this repository into Equicord's user plugin folder:

   ```
   src/userplugins/CopyEmbed
   ```

   ```
   git clone https://github.com/xMimiez/CopyEmbed.git src/userplugins/CopyEmbed
   ```

2. Build Equicord.
3. Reload Discord.
4. Enable **Copy Embed** under plugins if it is not already on.

Equicord enables the plugin the first time it sees it.

## Behavior and limits

- Button rows and other Components V2 parts that are not containers do not count as embeds.
- The copied JSON is the embed or container object stored on the message.
- One embed or one container is copied as a single object. More than one is copied as an array. A message with both is copied as an object with `embeds` and `components`.
- Discord's message objects are not a stable API. A client update can change where embeds are stored.

## Credits

- [xMimiez](https://github.com/xMimiez) (`Mime | @n0_.q3`)

## License

Copy Embed is licensed under the [MIT License](./LICENSE).
