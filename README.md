# ws-server

WebSocket-server för bestscooter.

Det finns två huvudsakliga flöden att använda sig av till servern. Båda kräver att klienten verifierar en token som är hämtad från api-servern.

Det första flödet handlar om att skicka uppdateringar till WebSocket-servern för att ge systemet information om resurserna.

Det andra flödet är till för att admins och kunder ska kunna abonnera på information som de behöver för sin användning av systemet, huvudsakligen för att få en karta som uppdateras i realtid.

## API-referens

- [Verifiering av klient](#verifiering-av-klient)
  - [IN verify](#⬅️-in-verify)
  - [UT verify](#-ut-verify)
- [Skicka uppdateringar från klient](#skicka-uppdateringar-från-klient)
  - [IN customer](#-in-customer)
  - [IN scooter](#-in-scooter)
  - [IN tripStart](#-in-tripstart)
  - [IN tripEnd](#-in-tripend)
  - [IN trip](#-in-trip)
- [Abonnera på uppdateringar från servern](#abonnera-på-uppdateringar-från-servern)
  - [IN subscribe](#-in-subscribe)
  - [UT scooter](#-ut-scooter)
  - [UT customer](#-ut-customer)
  - [UT trip](#-ut-trip)

## Verifiering av klient

### ⬅️ IN verify

```typescript
{
    message: "verify",
    token: string
}
```

### ➡️ UT verify

```typescript
{
    message: "verify",
    verified: boolean
}
```

## Skicka uppdateringar från klient

### ⬅️ IN customer

```typescript
{
    message: "customer",
    position?: [number, number]
}
```

### ⬅️ IN scooter

```typescript
{
    message: "scooter",
    position?: [number, number],
    battery?: number,
    status?: string,
    charging?: boolean
}
```

### ⬅️ IN tripStart

```typescript
{
    message: "tripStart",
    scooterId: number
}
```

### ⬅️ IN tripEnd

```typescript
{
    message: "tripEnd",
    scooterId: number,
    parkedCharging: boolean
}
```

### ⬅️ IN trip

`routeAppend` lägger till nya punkter till resans rutt, `route` ersätter hela resans rutt.

> [!WARNING]
> Använd inte `routeAppend` och `route` i samma PUT, det kan få oförutsedda resultat.


```typescript
{
    message: "trip",
    distance?: number,
    route?: [number, number][],
    routeAppend?: [number, number][]
}
```

## Abonnera på uppdateringar från servern

### ⬅️ IN subscribe

Ange vilken information du vill abonnera i `subscriptions`. Giltiga alternativ är:

- `scooterLimited`
- `scooter`
- `customer`
- `trip`

Kunder bör bara ha tillgång till att se tillgängliga elsparkcyklar på kartan, då finns scooterLimited som bara ger begränsad information om elsparkcyklar.

```typescript
{
    message: "subscribe",
    subscriptions: string[]
}
```

### ➡️ UT scooter

#### scooterLimited

Detta abonnemang är till för kundernas karta och ska bara visa cyklar som är parkerade, tillgängliga och har batterinivå över 50%.

```typescript
{
    message: "scooter",
    position?: [number, number],
    battery?: number,
    remove?: boolean
}
```

#### scooter

```typescript
{
    message: "scooter",
    position?: [number, number],
    battery?: number,
    status?: string,
    charging?: boolean,
    remove?: boolean
}
```

### ➡️ UT customer

```typescript
{
    message: "customer",
    position?: [number, number]
}
```

### ➡️ UT trip


```typescript
{
    message: "trip",
    timeStarted: string,
    timeEnded: string,
    distance: number,
    route: [number, number][]
}
```
