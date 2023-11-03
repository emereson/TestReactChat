import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io(`${import.meta.env.VITE_URL_API}`);

function App() {
  const chatContainerRef = useRef();
  const [messages, setMessages] = useState([]);
  const [newMenssage, setnewMenssage] = useState();
  const [name, setname] = useState("");
  const [message, setMessage] = useState("");
  const [viewEmoticons, setviewEmoticons] = useState(false);
  const emoticons = [
    "😊",
    "😁",
    "😂",
    "😃",
    "😄",
    "😅",
    "😆",
    "😇",
    "😈",
    "😉",
    "😊",
    "😋",
    "😌",
    "😍",
    "😎",
    "😏",
    "😐",
    "😑",
    "😒",
    "😓",
    "😔",
    "😕",
    "😖",
    "😗",
    "😘",
    "😙",
    "😚",
    "😛",
    "😜",
    "😝",
  ];

  // Función para manejar el cambio de nombre en el input
  const handleNameChange = () => {
    setname(document.getElementById("name").value);
  };

  // Escuchar eventos "chat" del servidor y actualizar el estado con el nuevo mensaje
  socket.on("chat", (chat) => {
    setnewMenssage(chat);
  });

  // Efecto para cargar mensajes cuando hay un nuevo mensaje (newMenssage) o al montar el componente
  useEffect(() => {
    fetch(`${import.meta.env.VITE_URL_API}/api/v1/messages`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [newMenssage]);

  // Función para manejar cambios en el input del mensaje
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  // Función para insertar un emoticono en el mensaje actual
  const insertEmoticon = (emoticon) => {
    setMessage(message + emoticon);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL_API}/api/v1/messages/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setMessage("");
    } catch (error) {
      console.error("Error posting data:", error.message);
    }
  };

  // Función para formatear la fecha en un formato legible
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="app__container">
      <h1 className="app__h1">CHAT REACT</h1>
      {name.length === 0 ? (
        ""
      ) : (
        <div className={"app__nameClose"}>
          <h3>Nombre: {name}</h3> <p onClick={() => setname("")}>Cerrar Chat</p>
        </div>
      )}
      <div className="app__boxChat">
        <section
          className={`app__sectionName  ${
            name.length === 0 ? "app__sectionNameTranslate" : ""
          }`}
        >
          <div className="appSectionName__div">
            <label htmlFor="name">Ingrese su Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="nombre"
              required
            />
          </div>
          <button className="appSectionName__button" onClick={handleNameChange}>
            Entrar Al Chat
          </button>
        </section>
        <section
          className={`app__sectionChat  ${
            name.length === 0 ? "" : "app__sectionChatTranslate"
          }`}
        >
          <article className="appSectionChat__article" ref={chatContainerRef}>
            {messages?.chats?.map((chat) => (
              <ul
                className={`appSectionChat__ul ${
                  chat.id % 2 === 1 ? "appSectionChat__ul-gray" : ""
                }`}
                key={chat.id}
              >
                <li className="appSectionChat__liName">
                  <p>{chat.name}</p> <span>{formatDate(chat.createdAt)}</span>
                </li>
                <li className="appSectionChat__liMessage">{chat.message}</li>
              </ul>
            ))}
          </article>
          <form className="appSectionChat__form" onSubmit={handleSubmit}>
            <div className="appSectionChatForm__div">
              <input
                type="text"
                id="message"
                name="message"
                placeholder="Escribe un comentario"
                value={message}
                onChange={(e) => handleInputChange(e)}
                required
              />
              <p onClick={() => setviewEmoticons(!viewEmoticons)}>😀</p>
            </div>
            <div
              className={`appSectionChatForm__div-emoticones  ${
                viewEmoticons ? "" : "appSectionChatForm__div-emoticones-close"
              }`}
            >
              {emoticons.map((emoticon, index) => (
                <span key={index} onClick={() => insertEmoticon(emoticon)}>
                  {emoticon}
                </span>
              ))}
            </div>
            <button type="submit">Enviar</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default App;
