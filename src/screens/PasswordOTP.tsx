export default function PasswordOTP() {
  return (
    // <div style={{
    //   width: "100%",
    //   display: "flex",
    //   alignItems: "center",
    //   padding: "50px 0px",
    //   backgroundColor: "#eaeaea",
    //   flexDirection: "column"
    // }}>
    //   <div style={{
    //     width: "800px",
    //     backgroundColor: "#fff",
    //     color: "#333",
    //     display: "flex",
    //     flexDirection: "column",
    //     alignItems: "center",
    //     // gap: "10px",
    //     borderRadius: "10px",
    //     padding: "40px",
    //     borderTop: "5px solid  #FF4274",
    //     textAlign: "center"
    //   }}>
    //     <img src="https://static.bell.zeroweb.kr/public/bell-logo.png" width="200"/>
    //     <h1>Dear abubakr</h1>
    //     <p style={{textAlign: "center"}}>We have received a request to reset your password for your account. To ensure the security of your account, we are providing you with a One-Time Password to complete the password reset process.</p>
    //     <p>Please find your OTP below:</p>
    //     <h1>OTP: <span style={{color: "#301E72"}}>F4NJENF</span></h1>
    //     <span>For security reasons, please ensure that you reset your password. This OTP is valid for 10 minutes.</span>
    //     <span>If you did not request this password reset, please contact our support team at <a href="/">bell@zeroweb.kr</a> </span>
    //     <span>Thank you for using our services!</span>
    //   </div>
    //
    //   <img src="https://static.bell.zeroweb.kr/public/bell-logo.png" width="100" style={{marginTop: "50px", marginBottom: "20px"}}/>
    //   <div style={{
    //     display: "flex",
    //     gap: "10px"
    //   }}>
    //     <a href={"/"}>Privacy Policy</a>
    //     <a href={"/"}>Contact Support</a>
    //   </div>
    //   <span className="addr">Busan, Haeundae-gu 140, Suyeonggangbyeon-daero, 140, BCC 8F, 806 </span>
    //   <span>© 2023 Bell Inc</span>
    // </div>
    <div>
      <table align={"center"} style={{
            margin: "50px auto",
            width: "800px",
            backgroundColor: "#fff",
            color: "#333",
            borderRadius: "10px",
            padding: "40px",
            borderTop: "5px solid  #FF4274",
            textAlign: "center"
      }}>
        <tbody>
          <tr>
            <td>
              <img src="https://static.bell.zeroweb.kr/public/bell-logo.png" width="200"/>
              <h1>Dear abubakr</h1>
              <p style={{textAlign: "center"}}>We have received a request to reset your password for your account. To ensure the security of your account, we are providing you with a One-Time Password to complete the password reset process.</p>
              <p>Please find your OTP below:</p>
              <h1>OTP: <span style={{color: "#301E72"}}>F4NJENF</span></h1>
              <span>For security reasons, please ensure that you reset your password. This OTP is valid for 10 minutes.</span>
              <span>If you did not request this password reset, please contact our support team at <a href="/">bell@zeroweb.kr</a> </span>
              <span>Thank you for using our services!</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{
        margin: "0 auto",
        width: "800px"
      }}>
        <img src="https://static.bell.zeroweb.kr/public/bell-logo.png" width="100" style={{marginTop: "50px", marginBottom: "20px"}}/>
        <div style={{
          display: "flex",
          gap: "10px"
        }}>
          <a href={"/"}>Privacy Policy</a>
          <a href={"/"}>Contact Support</a>
        </div>
        <span className="addr">Busan, Haeundae-gu 140, Suyeonggangbyeon-daero, 140, BCC 8F, 806 </span>
        <span>© 2023 Bell Inc</span>
      </div>
    </div>
  )
}
