import {DeclarationData, FinancialDetail, NetWorthIncreaseAnalysis, NWAnalysisAvailableYear} from "../../../APIModel";
import {
    Button,
    Card,
    Col,
    Descriptions,
    Form,
    Input,
    Modal,
    Radio,
    Row,
    Space,
    Timeline,
    Tooltip,
    Typography
} from "antd";
import React, {useEffect, useMemo, useState} from "react";
import {formatMoney, formatToDay} from "../../../formatters";
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {Loading} from "../../../components/Loading";
import {ExternalLinkIcon} from "../../../components/icons/ExternalLinkIcon";
import {Disable} from "react-disable";
import {DisclaimerComponent} from "../../../components/Disclaimer";
import {AmountInput} from "./AmountInput";
import {merge} from 'lodash';
import './InputData.css';
import {useDJBRStats} from "../../../hooks/useStats";
import {useMediaQuery} from "@react-hook/media-query";


export function InputData(props: {
    data: NetWorthIncreaseAnalysis;
    disabled: boolean;
    updateDate: (newData: DeclarationData) => void;
    updateSingleYear: (prev: DeclarationData, newData: NWAnalysisAvailableYear) => void
}) {

    const [currentYearToChange, setCurrentYearToChange] = useState<DeclarationData>();

    return <Disable disabled={props.disabled}>
        <Row gutter={[0, 16]} className="nw-input">
            <Col xs={24}>
                <Typography.Title level={5} className="title-color">
                    Datos
                </Typography.Title>
            </Col>
            <Col xs={24}>
                <Card className="custom-card-no-shadow">
                    <InputTitle data={props.data.firstYear}
                                prefix="Declaración Inicial"
                                onClick={() => setCurrentYearToChange(props.data.firstYear)}/>
                    <SingleDeclaration data={props.data.firstYear} update={props.updateDate}/>
                </Card>
            </Col>
            <Col xs={24}>
                <Card className="custom-card-no-shadow">
                    <InputTitle data={props.data.lastYear}
                                prefix="Declaración final"
                                onClick={() => setCurrentYearToChange(props.data.lastYear)}/>
                    <SingleDeclaration data={props.data.lastYear} update={props.updateDate}/>
                </Card>
            </Col>

            <SelectDeclarationModal
                options={props.data.availableYears}
                current={currentYearToChange}
                visible={!!currentYearToChange}
                onSelect={y => {
                    if (!currentYearToChange) return;
                    props.updateSingleYear(currentYearToChange, y);
                    setCurrentYearToChange(undefined);
                }}
                onCancel={() => setCurrentYearToChange(undefined)}/>

        </Row>
    </Disable>
}

function InputTitle(props: {
    data: DeclarationData;
    onClick: () => void;
    prefix: string;
}) {

    return <Typography.Title level={5} className="title-color">
        <Tooltip title="Ver información de fuente">
            <div onClick={props.onClick}
                 style={{
                     color: 'rgb(24, 144, 255)',
                     textDecoration: 'underline',
                     cursor: 'pointer'
                 }}
            >
                {props.prefix} (Año {props.data.year})
            </div>
        </Tooltip>
    </Typography.Title>
}

function getLink(dat: DeclarationData): string | undefined {
    return dat.sources.filter(val => val.type === 'DJBR').map(v => v.url).shift();
}

function SelectDeclarationModal(props: {
    options: NWAnalysisAvailableYear[];
    current?: DeclarationData;
    visible: boolean;
    onSelect: (newVal: NWAnalysisAvailableYear) => void;
    onCancel: () => void;
}) {

    const statistics = useDJBRStats();
    const isSmall = useMediaQuery('only screen and (max-width: 900px)');

    return <Modal title="Datos de la declaración"
                  visible={props.visible}
                  cancelText="Cancelar"
                  okButtonProps={{style: {display: 'none'}}}
                  width={isSmall ? "80%" : undefined}
                  onCancel={props.onCancel}>
        {props.current && <Space direction="vertical" size={16}>

            <Card className="custom-card-no-shadow left-align">
                <Descriptions column={1} title="Declaración actual" size="small">
                    <Descriptions.Item label="Documento original">
                        <a href={getLink(props.current)} target="__blank">
                            <Space>
                                Ver PDF
                                <ExternalLinkIcon/>
                            </Space>
                        </a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Año">
                        {props.current.year}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
            <DisclaimerComponent full card>
                El portal cuenta en total con {formatMoney(statistics.total_declarations)} declaraciones
                juradas de empleados públicos.

                <br/>
                Podrían existir declaraciones juradas presentadas, pero
                que no han sido publicadas por la CGR o aún no han sido incorporadas a este
                portal. <a href="https://portaldjbr.contraloria.gov.py/portal-djbr/" target="_blank"
                           rel="noopener noreferrer"> Ver fuente.</a>
            </DisclaimerComponent>
            {props.options.length
                ? <Card className="custom-card-no-shadow left-align"
                        title="Puedes cambiar por otra declaración, elige una">
                    <Timeline>
                        {props.options.map(op => <Timeline.Item key={op.year}>
                            <Space>
                                <div>
                                    Declaración al {formatToDay(op.date)} (
                                    <a href={op.link}>
                                        <Space align="end">
                                            Ver PDF
                                            <ExternalLinkIcon/>
                                        </Space>
                                    </a>)
                                </div>
                                <Button onClick={() => props.onSelect(op)}>Seleccionar</Button>
                            </Space>
                        </Timeline.Item>)}
                    </Timeline>
                </Card>
                : <DisclaimerComponent full card>No se cuentan con otras declaraciones</DisclaimerComponent>
            }

            {props.options.length
                ? <DisclaimerComponent full card>
                    Al cambiar de declaración, se perderán los datos que hayas modificado manualmente
                </DisclaimerComponent>
                : null
            }

        </Space>}
        {!props.current && <Loading/>}
    </Modal>
}

export function SingleDeclaration(props: {
    data: DeclarationData,
    update: (newData: DeclarationData) => void
}) {
    const [form] = Form.useForm();
    const layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
    };

    useEffect(() => {
        form.setFieldsValue(props.data);
        // we know we should override the data only if the year changes
        // eslint-disable-next-line
    }, [props.data.year, form])

    const inputTooltip = useMemo(() => {
        return `Ingresos aproximados utilizando los datos proveídos, fuentes: ${props.data.totalIncome.source}.
                Este número se obtiene multiplicando los ingresos mensuales por 12 y luego se le suma todos los
                ingresos anuales cargados.`;
    }, [props.data.totalIncome])

    const nwTooltip = useMemo(() => {
        return `Patrimonio neto aproximado utilizando los datos proveídos, fuentes: ${props.data.netWorth.source}.
                Este número se obtiene restando los pasivos de los activos.`;
    }, [props.data.netWorth])

    return <Form {...layout}
                 form={form}
                 name={`dec_form_${props.data.year}`}
                 size="small"
                 initialValues={props.data}
                 onValuesChange={(ch, all) => {
                     const newData = merge(
                         props.data,
                         all
                     );
                     props.update(newData);
                 }}
    >
        <Form.Item name={["totalActive"]} label="Total activos:" rules={[{required: true}]}>
            <AmountInput placeholder="Total activos"/>
        </Form.Item>
        <Form.Item name={["totalPassive"]} label="Total Pasivos:" rules={[{required: true}]}>
            <AmountInput placeholder="Total pasivos"/>
        </Form.Item>

        <Form.List name="incomes">
            {(fields, funcs) => (
                <>
                    {fields.map(field => {

                        const val: FinancialDetail = props.data.incomes[field.name];
                        return <Form.Item label={val?.name} key={field.name}>
                            <Input.Group compact>
                                <Form.Item name={[field.name]}
                                           fieldKey={[field.fieldKey]}
                                           className="income-amount"
                                           required>
                                    <AmountInput/>
                                </Form.Item>
                                <Tooltip title="Indica si el ingreso es mensual o anual">
                                    <Form.Item name={[field.name, "periodicity"]}
                                               fieldKey={[field.fieldKey, "periodicity"]}>
                                        <Radio.Group>
                                            <Radio.Button value="monthly"
                                                          style={{width: '100%'}}>Mensual</Radio.Button>
                                            <Radio.Button value="yearly"
                                                          style={{width: '100%'}}>Anual</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Tooltip>
                                <Form.Item>
                                    <Tooltip title="Eliminar ingreso">
                                        <Button type="primary" icon={<DeleteOutlined/>}
                                                danger
                                                onClick={() => funcs.remove(field.name)}/>
                                    </Tooltip>
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
                    })}

                    <Form.Item wrapperCol={{span: 24}}>
                        <Button type="dashed" onClick={() => funcs.add({
                            periodicity: 'monthly',
                            amount: 0,
                            source: 'MANUAL',
                            observation: '',
                            name: `Ingreso`
                        })} block icon={<PlusOutlined/>}>
                            Agregar Ingreso
                        </Button>
                    </Form.Item>
                </>
            )}

        </Form.List>

        <Form.Item label="Ingresos por año">
            <AmountInput disabled title={inputTooltip} value={props.data.totalIncome}/>
        </Form.Item>
        <Form.Item label="Patrimonio Neto">
            <AmountInput disabled title={nwTooltip} value={props.data.netWorth}/>
        </Form.Item>
    </Form>;
}


