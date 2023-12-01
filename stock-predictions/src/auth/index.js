import { reactive } from 'vue';
import axios from 'axios';

const status = reactive({
    success: false,
    failed: false,
    error: false,
    errorMsg: ""
});

const validate = async () => {
    status.success = false;
    status.failed = false;
    try {
        await axios.get('/users/view');
        status.success = true;
    } catch(error) {
        status.failed = true;
    }
}

export default { status, validate };