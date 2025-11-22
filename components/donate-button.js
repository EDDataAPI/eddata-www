export default function DonateButton() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 100,
        animation: 'fadeIn 0.5s ease-in'
      }}
    >
      <form
        action='https://www.paypal.com/donate'
        method='post'
        target='_top'
        style={{
          margin: 0,
          padding: 0
        }}
      >
        <input type='hidden' name='hosted_button_id' value='83JB2X6H7DHXJ' />
        <button
          type='submit'
          style={{
            border: 'none',
            padding: 0,
            background: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
          title='Support EDData with a donation'
        >
          <img
            src='https://www.paypalobjects.com/en_US/AT/i/btn/btn_donateCC_LG.gif'
            border='0'
            alt='Donate with PayPal button'
            style={{
              display: 'block',
              width: '190px',
              height: 'auto'
            }}
          />
        </button>
        <img
          alt=''
          border='0'
          src='https://www.paypal.com/en_AT/i/scr/pixel.gif'
          width='1'
          height='1'
          style={{ display: 'none' }}
        />
      </form>
      <style>{`
        @media (max-width: 768px) {
          div[style*="position: fixed"] {
            bottom: 1rem !important;
            right: 1rem !important;
          }
          button img {
            width: 150px !important;
          }
        }
      `}</style>
    </div>
  )
}
