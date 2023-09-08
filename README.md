# Bienvenido a YourGacha for Anilist
>En este repositorio encontrarás todo acerca del proceso de desarrollo de YourGacha, un gacha de personajes anime online.
***
## Páginas necesarias
> Las marcadas con una X son las páginas cuyo diseño ya está terminado.

- [ ] Inicio
- [ ] Registro/Inicio de sesión
- [ ] Gacha
- [ ] Resultados del gacha
- [ ] Colección
- [ ] Tienda
- [ ] Perfil del usuario
- [ ] Configuración
- [ ] Noticias/Actualizaciones
- [ ] Soporte/Contacto
- [ ] Términos y condiciones/Política de Privacidad
- [ ] FAQ
- [ ] Invitar a amigos
- [ ] Foro/Comunidad
***
### Tecnologías necesarias
1. [React](https://es.react.dev/) y [NodeJS](https://nodejs.org/es)
2. [Firebase](https://firebase.google.com) Database, Storage, Auth, Hosting
3. [Visual Studio Code](https://code.visualstudio.com/)
4. [Express.js](https://expressjs.com/es/)
5. [Tailwind CSS](https://tailwindcss.com/)
6. [GitHub](https://github.com)
***
### Organización de la base de datos
#### Usuarios
```typescript
interface User {
    uid: string;
    name: string;
    email: string;
    profileImageUrl?: string;
    acquiredCharacters?: number[];
    score?: number;
    level?: number;
    achievements?: number[];
    virtualCurrency?: number;
    registrationDate: Date;
    gamePreferences?: GamePreferences;
    transactionHistory?: Transaction[];
    lastLoginDate?: Date;
    userStatus?: "online" | "idle" | "dnd";
}

interface GamePreferences {
    language: string;
    notificationsEnabled: boolean;
    soundVolume: number;
}

interface Transaction {
    date: Date;
    item: string;
    price: number;
}
```
#### Personajes
Los más de 300K personajes están dentro de un archivo JSON