import React from 'react';
import styled from 'styled-components';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue } from 'recoil';

import { HiArrowRight } from 'react-icons/hi';

import { taskActions, taskState } from '@/store';

import Button from '@/components/common/buttons/Button';
import Row from '@/components/common/Row';
import Column from '@/components/common/Column';
import Section from '@/components/common/Section';
import Toggle from '@/components/common/Toggle';
import TriToggle from '@/components/common/TriToggle';
import NumberInput from '@/components/common/input/NumberInput';
import Field from '@/components/common/Field';
import { InfoTextDefault } from '@/components/common/texts/InfoText';

import styles from '@/styles/styles';
import { AiOutlineWarning } from 'react-icons/ai';
import { maxPossibleBoxesPerPallet } from '@/store/task/selectors';
import lodash from 'lodash';

const Wrapper = styled.div`
  padding-left: 80px;
`;

const LayerLabel = styled.h2`
  color: ${styles.colors.gray3};
  margin: 0 0 16px 0;
`;

const RepeatLabel = styled.h3`
  width: 100%;
  text-align: center;
  font-weight: 500;
  color: ${styles.colors.gray4};
`;

const LayerAdjustment = ({ t }: WithTranslation) => {
  const [task, setTask] = useRecoilState(taskState);
  const { layers } = task;

  const next = () => {
    taskActions.goToStep(task, setTask, 'summary');
  };

  const back = () => {
    taskActions.goToStep(task, setTask, 'pattern');
  };

  const onToggleRotation = (index: number, rotation: 0 | 90) => {
    console.log('layer:', layers);
    const layer = layers[index];
    let newlayer = { ...layer, rotation };
    let newLayers = [...layers];
    newLayers[index] = newlayer;
    // if (task.isDoubleStack) {
    //   if (index === 0 || index === 1) {
    //     let newlayer0 = { ...layers[0], rotation };
    //     let newlayer1 = { ...layers[1], rotation };
    //     newLayers[0] = newlayer0;
    //     newLayers[1] = newlayer1;
    //   } else if (index === 2 || index === 3) {
    //     let newlayer2 = { ...layers[2], rotation };
    //     let newlayer3 = { ...layers[3], rotation };
    //     newLayers[2] = newlayer2;
    //     newLayers[3] = newlayer3;
    //   }
    // }
    taskActions.setLayer(task, setTask, newLayers);
  };

  const onToggleFlip = (index: number, flipValue: number) => {
    const flipH = flipValue == 1
    const flipV = flipValue == 2

    console.log('layer:', layers);
    const layer = layers[index];
    let newlayer = { ...layer, flipH, flipV };
    let newLayers = [...layers];
    newLayers[index] = newlayer;
    // if (task.isDoubleStack) {
    //   if (index === 0 || index === 1) {
    //     let newlayer0 = { ...layers[0], flipH, flipV };
    //     let newlayer1 = { ...layers[1], flipH, flipV };
    //     newLayers[0] = newlayer0;
    //     newLayers[1] = newlayer1;
    //   } else if (index === 2 || index === 3) {
    //     let newlayer2 = { ...layers[2], flipH, flipV };
    //     let newlayer3 = { ...layers[3], flipH, flipV };
    //     newLayers[2] = newlayer2;
    //     newLayers[3] = newlayer3;
    //   }
    // }
    taskActions.setLayer(task, setTask, newLayers);
  };

  const onBoxAmountInputChange = (boxAmount: string) => {
    let boxAmountValue: number | undefined = parseInt(boxAmount);
    if (isNaN(boxAmountValue)) {
      //boxAmountValue = task.previewBoxes.length * task.layout.length;
    } else {
      taskActions.setBoxAmount(task, setTask, boxAmountValue);
    }
  };

  const onRotateFlipEveryChange = (rotateFlipEvery:string)=>{
    let rotateFlipEveryValue: number | undefined = parseInt(rotateFlipEvery);
    taskActions.setRotateFlipEvery(task,setTask,rotateFlipEveryValue);
  }

  const valMaxPossibleBoxesPerPallet = useRecoilValue(
    maxPossibleBoxesPerPallet
  );

  return (
    <Wrapper>
      <h1>{t('taskbuilder.layer.title')}</h1>
      <Section>
        <Row className="items-center">
          <Column className="col-3" />
          <Column className="col-4 justify-center">
            <h3 style={{ marginTop: 0 }}>
              {t('taskbuilder.layer.options.rotate')}
            </h3>
          </Column>
          <Column className="col-4 justify-center">
            <h3 style={{ marginTop: 0 }}>
              {t('taskbuilder.layer.options.flip')}
            </h3>
          </Column>
        </Row>
        {layers.map((layer, index) => {
          return (
            <Row className="items-center" key={index}>
              <Column className="col-3">
                <LayerLabel>
                  {t('taskbuilder.layer.label').replace(
                    '{number}',
                    String(index * task.rotateFlipEvery + 1)
                  )}
                  {
                    task.rotateFlipEvery > 1
                      ? ' - ' + (index + 1) * task.rotateFlipEvery
                      : ''
                  }
                </LayerLabel>
              </Column>
              <Column className="col-4 justify-center">
                <Toggle
                  offLabel={'0'}
                  offValue={0}
                  onLabel={'90'}
                  onValue={90}
                  selected={layer.rotation || 0}
                  onToggle={(rotation: 0 | 90) =>
                    onToggleRotation(index, rotation)
                  }
                />
              </Column>
              {/* <Column className="col-4 justify-center">
                <Toggle
                  offLabel={t('common.no')}
                  offValue={false}
                  onLabel={t('common.yes')}
                  onValue={true}
                  selected={layer.flipV || false}
                  onToggle={(flipV: boolean) => onToggleFlipV(index, flipV)}
                />
              </Column> */}
              <Column className="col-4 justify-center">
                <TriToggle
                  label_0={'ไม่'}
                  label_1={'บนล่าง'}
                  label_2={'ซ้ายขวา'}
                  value_0={0}
                  value_1={1}
                  value_2={2}
                  selected={layer.flipH ? 1 : layer.flipV ? 2 : 0}
                  onToggle={(flipValue) => onToggleFlip(index, flipValue)}
                />
              </Column>
            </Row>
          );
        })}
        <Row>
          <Column className="col-3">
            <LayerLabel>
              &emsp;...
            </LayerLabel>
          </Column>
        </Row>
        <Row>
          <Column className="col-3">
            <LayerLabel>

            </LayerLabel>
          </Column>
        </Row>
        <Row>
          <Field
            label={t('หมุน/สลับ ทุกๆ')}
            slot={
              <NumberInput
                keyboardPosition="bottom"
                value={task.rotateFlipEvery?.toString()}
                label={`${t('common.max')}: ${"ชั้น"}`}
                onChange={onRotateFlipEveryChange}
              />
            }
            labelCol={4}
          />
          {/* Max possible bundles:{task.previewBoxes.length*task.layout.length}*/}
        </Row>
        <Row>
          ถ้าเปิดตัวหยิบซ้อน ต้องเป็นเลขคู่ 2,4,6,8, ... เท่านั้น
        </Row>
      </Section>
      <Row>
        <Field
          label={t('taskbuilder.layer.bundleperpallet')}
          slot={
            <NumberInput
              keyboardPosition="top"
              value={task.boxAmount?.toString()}
              label={`${t('common.max')}: ${valMaxPossibleBoxesPerPallet}`}
              onChange={onBoxAmountInputChange}
            />
          }
          labelCol={4}
        />
        {/* Max possible bundles:{task.previewBoxes.length*task.layout.length}*/}
      </Row>
      <Row>
        <Field
          label={'แผ่นกระดาษคั่น'}
          slot={
            <div
              style={{
                marginLeft: 10,
                width: 100,
              }}
            >
              <Row>
                <Column>
                  <Toggle
                    offLabel={'ไม่มี'}
                    offValue={false}
                    onLabel={'มี'}
                    onValue={true}
                    selected={task.isSlipSheet}
                    onToggle={(isSlipSheet: boolean) => {
                      taskActions.setIsSlipSheet(task, setTask, isSlipSheet);
                    }}
                  />{' '}
                </Column>
                <Column>
                  <div style={{ width: 200, height: 75, marginLeft: 20 }}>
                    {task.isSlipSheet && (
                      <Field
                        label={'ทุกๆ'}
                        slot={
                          <NumberInput
                            keyboardPosition="top"
                            value={task.slipSheetEvery?.toString()}
                            label={'ชั้น'}
                            onChange={(everyNumber: string) => {
                              taskActions.setSlipSheetEvery(
                                task,
                                setTask,
                                parseInt(everyNumber)
                              );
                            }}
                          />
                        }
                        labelCol={4}
                      />
                    )}
                  </div>
                </Column>
              </Row>
            </div>
          }
          labelCol={4}
        />
      </Row>
      <Row>
        {task.boxAmount !== undefined &&
        task.previewBoxes.length * task.layout.length < task.boxAmount ? (
          <InfoTextDefault>
            <AiOutlineWarning />
            &nbsp;{t('validation.pallet.exceed')}
          </InfoTextDefault>
        ) : (
          <></>
        )}
        {task.isSlipSheet !== false &&
        (task.slipSheetEvery < 0 ||
          task.slipSheetEvery > task.previewBoxes.length) ? (
          <InfoTextDefault>
            <AiOutlineWarning />
            &nbsp;invalid number of slipsheet
          </InfoTextDefault>
        ) : (
          <></>
        )}
      </Row>
      <Row style={{ paddingTop: '24px' }}>
        <Button label={t('common.back')} className="secondary" onTap={back} />
        <Button
          label={t('common.next')}
          rearIcon={<HiArrowRight />}
          onTap={next}
        />
      </Row>
    </Wrapper>
  );
};

export default withTranslation()(LayerAdjustment);
