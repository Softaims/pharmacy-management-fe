const Message = ({ notification }) => {
  return (
    <>
      <div id="notificationHeader"></div>
      <div id="notificationBody">{notification.body}</div>
    </>
  );
};
export default Message;
