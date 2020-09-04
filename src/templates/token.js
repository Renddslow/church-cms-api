const ADMIN_URL = process.env.ADMIN_URL;

const Token = (token) => {
  const url = `${ADMIN_URL}/authorize?token=${token}`;
  return `
<html>
  <head>
    <style>    
        .btn {
            padding: 12px 24px;
            box-sizing: border-box;
            font-size: 16px;
            appearance: none;
            -webkit-appearance: none;
            border: none;
            border-radius: 8px;
            background: #FAFFFD;
            font-weight: 600;
            display: block;
            max-width: max-content;
            text-decoration: none;
            color: #342E37;
            line-height: 1.2!important;
        }
        
        .btn.btn--primary {
            background: #3C91E6;
            color: #FAFFFD;
        }
        code {
          padding: .2em .4em;
          margin: 0;
          font-size: 85%;
          background-color: rgba(27,31,35,.05);
          border-radius: 6px;
        }
    </style>
  </head>
  <body>
    <p>Hi there!</p>
    <br />
    <p>🧙‍♂️ Here's the magic link you've requested:</p>
    <br />
    <a href="${url}" class="btn btn--primary">Login!</a>
    <br />
    <p><small>Pst, having trouble with the button? Copy and paste this guy into your address bar:</small></p>
    <code>${url}</code>
  </body>
</html>
`;
};

module.exports = Token;
