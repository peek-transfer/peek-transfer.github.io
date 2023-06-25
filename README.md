## About Peek

Peek is a static web project for peer-to-peer communication, using peerjs' server as the contact server. A live peer-to-peer communication line can be established simply by successfully passing the ids of both parties using other methods.

Peek does not have a central server and therefore does not keep any chat logs, all chats are only stored on both parties' devices and therefore all chats are lost when the page is closed.

## How it works

After opening [peek-transfer](https://peek-transfer.github.io) on both devices and waiting for a moment, peek will configure a device ID for each device. Afterwards, use email or other means to pass the device ID of one device to the other device and fill in the input box, click Connect, select agree on the other device and wait a moment for the connection to be established.

You can also use the camera to scan the QR code directly and then open the scanned link to automatically connect the two devices.

Once the connection has been established, you can transfer files and text content to each other. Please download any files you receive in time, as they will be erased when the web page is closed or you manually exit the connection.

Once a connection has been established, Peek will retain the other person's ID for the next direct connection.

> Tips: You can change your user name by clicking on the round avatar button.

## Todo

1. Chat log export function

--------------

## 关于 Peek

Peek 是一个用于点对点通讯的静态网页项目，它使用 peerjs 的服务器作为联络服务器。只需要使用其它方式成功传递双方的 id 后即可建立实时点对点通讯线路。

Peek 没有中心服务器，因此不会保存任何聊天记录，所有聊天记录只存在于双方的设备中，也因此，所有的聊天记录都会在网页被关闭后消失，后续可能会提供导出聊天记录的功能。

## 如何使用

在两台设备上同时打开[peek-transfer](https://peek-transfer.github.io)后，等待片刻，peek会为每个设备配置一个设备ID。之后，使用电子邮件或者其他方式传递其中一个设备的设备ID到另一个设备上，并填入输入框中，点击连接，在另一台设备上选择同意，等待一会即可建立连接。

也可以使用摄像头直接扫描分享二维码，然后打开扫描获取的链接，即可自动连接两台设备。

在建立连接后即可互相传输文件和文本内容，请及时下载接收到的文件，因为在网页关闭或者手动退出连接后，这些文件和聊天记录将被清除。

成功建立连接后，Peek将会保留对方ID，方便下一次直接连接。

> Tips: 点击圆形头像按钮可以修改用户名称。

## Todo

1. 聊天记录导出功能
