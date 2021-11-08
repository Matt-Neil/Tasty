import axios from "axios";

export default axios.create({
    baseURL: "http://tasty-env.eba-c5emmwpy.eu-west-2.elasticbeanstalk.com/api/chats",
    withCredentials: true
});