import React from 'react'
import YouTubeIcon from '@material-ui/icons/YouTube';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import PinterestIcon from '@material-ui/icons/Pinterest';
const moment = require('moment');

const Footer = () => {
    return (
        <div className="footer">
            <div className="footerTop">
                <div className="footerLeft">
                    <div className="footerSocialButton">
                        <YouTubeIcon style={{fontSize: 20}} />
                    </div>
                    <div className="footerSocialButton">
                        <FacebookIcon style={{fontSize: 20}} />
                    </div>
                    <div className="footerSocialButton">
                        <InstagramIcon style={{fontSize: 20}} />
                    </div>
                    <div className="footerSocialButton">
                        <TwitterIcon style={{fontSize: 20}} />
                    </div>
                    <div className="footerSocialButton">
                        <PinterestIcon />
                    </div>
                </div>
                <p className="footerRight text3">Subscribe to Tasty.</p>
            </div>
            <p className="footerBottom text6">{moment().format('YYYY')} Tasty Co. Ltd, all rights reserved worldwide. E & OE.</p>
        </div>
    )
}

export default Footer
