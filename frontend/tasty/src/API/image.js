import axios from "axios";

export default axios.create({
    baseURL: "tasty-env.eba-c5emmwpy.eu-west-2.elasticbeanstalk.com/api/image",
    withCredentials: true
});