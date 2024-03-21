import Button from 'react-bootstrap/Button';

function ForceRefresh() {

    function clickHandler() {
        // 캐시를 무시하고 새로고침을 강제로 수행
        window.location.reload(true);
    }

    return (
        <Button
            variant='light'
            size='sm'
            onClick={() => clickHandler()}
        >🔁강력 새로고침</Button>
    )
}

export default ForceRefresh;