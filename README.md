# ws-server

WebSocket-server för bestscooter.

Det finns två huvudsakliga flöden att använda sig av till servern. Båda kräver att klienten verifierar en token som är hämtad från api-servern.

Det första flödet handlar om att skicka uppdateringar till WebSocket-servern för att ge systemet information om resurserna.

Det andra flödet är till för att admins och kunder ska kunna abonnera på information som de behöver för sin användning av systemet, huvudsakligen för att få en karta som uppdateras i realtid.

## client ➡️ server

:arrow_left: ⬅️

### verificate

### customerPosition

### scooterPosition

### scooterParking

### tripStart

### tripPosition

### tripEnd

## server ➡️ client

### verificateConfirm

any

### customerPosition

admins

### customerShow

admins

### customerHide

admins

### scooterPosition

Admins från alla elsparkcyklars position. Kunder från enbart parkerade och laddade (> 50% laddning) cyklars position.

### scooterPark

admins

### scooterUnpark

admins
