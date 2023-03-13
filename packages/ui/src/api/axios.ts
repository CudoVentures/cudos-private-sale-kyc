import axios from 'axios';
import { APP_DETAILS } from 'utils/constants';

const instance = axios.create({
    headers: {
        'x-api-key': APP_DETAILS.apiKey
    }
});

export default instance;
