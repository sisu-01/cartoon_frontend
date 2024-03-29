import React, { useEffect, useState } from 'react';

import Cookies from 'js-cookie';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function AlertModal() {
    const [showModal, setShowModal] = useState(false);
    const [skipPopup, setSkipPopup] = useState(false);

    useEffect(() => {
        const skipPopup = Cookies.get('skipPopup');
        if (skipPopup === undefined) {
            setShowModal(true);
        }
    }, []);

    function closeModal() {
        if (skipPopup) {
            Cookies.set('skipPopup', 'true', { expires: 7, path: '/' });
        }
        setShowModal(false);
    }

    return (
        <Modal
            show={showModal}
            backdrop='static'
            keyboard={false}
            centered
        >
            <Modal.Header className='justify-content-center'>
                <Modal.Title className='fw-bold'>⚠&nbsp;알림&nbsp;⚠</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>
                    자극적인 만화가 있을 수 있으니 주의하라는 내용의 안내문<br/><br/>
                    내용 추천 받습니다~
                    {/* 대충 자유로운 만큼 무법지대라는 내용.<br/><br/>
                    정치적, 반사회적, 혐오적, 성적 컨텐츠가 있을 수 있으니 주의하라는 내용.<br/><br/>
                    하지만 이에 해당하지 않는 재밌는 만화들이 훨씬 많으니 걱정 할 필요 없다는 내용. */}
                </h5>
            </Modal.Body>
            <Modal.Footer className='justify-content-between'>
                <Form.Check
                    type='checkbox'
                    id='week'
                    label='일주일간 보지 않기'
                    checked={skipPopup}
                    onChange={() => setSkipPopup(!skipPopup)}
                />
                <Button variant="primary" onClick={closeModal}>이해했어요!</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AlertModal;