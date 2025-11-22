export default function DonateButton() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 100
      }}
    >
      <form
        action='https://www.paypal.com/donate'
        method='post'
        target='_blank'
        style={{
          margin: 0,
          padding: 0
        }}
      >
        <input type='hidden' name='hosted_button_id' value='83JB2X6H7DHXJ' />
        <button
          type='submit'
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070ba',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#005a87'
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#0070ba'
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
          }}
          title='Support EDData with a donation'
        >
          <span style={{ fontSize: '18px' }}>❤️</span>
          <span>Donate</span>
        </button>
      </form>
    </div>
  )
}
