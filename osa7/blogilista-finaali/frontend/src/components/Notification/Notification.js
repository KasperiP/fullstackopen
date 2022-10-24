const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  if (type === 'error') {
    return (
      <div
        style={{
          color: 'red',
          background: 'pink',
          padding: '10px',
        }}
      >
        {message}
      </div>
    )
  }

  if (type === 'success') {
    return (
      <div
        style={{
          color: 'green',
          background: 'lightgreen',
          padding: '10px',
        }}
      >
        {message}
      </div>
    )
  }
}

export default Notification
