import _ from "lodash";
import {Button, Collapse, Drawer, FloatButton, Form, Input, Modal, Select, Space, Tabs, Tooltip} from "antd";
import {useState} from "react";
import optionType from "@/configs/optionType";
import {
	HeartTwoTone,
	GroupOutlined,
	StarOutlined,
	MinusCircleOutlined,
	PlusOutlined,
	DownOutlined,
	ArrowDownOutlined,
	ArrowUpOutlined,
	DeleteOutlined,
	FileTextOutlined,
	EyeOutlined
} from '@ant-design/icons';

import BasicComponent from "@comp/modules/BasicModule";
import "./index.less"
import mockData from "@/configs/mock";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';


const items = [
	{key: '1', label: '组件属性',},
	{key: '2', label: '组件布局',},
];

/**
 * @author Kevin
 * @Date: 2024-4-19
 */
function Builder() {
	// 问卷题目集合
	const [data, setData] = useState([])
	// 问卷标题
	const [questionnaireTitle, setQuestionnaireTitle] = useState("问卷")
	// 问卷副标题
	const [questionnaireSubTitle, setQuestionnaireSubTitle] = useState("感谢您抽出几分钟时间填写以下内容，现在我们开始吧")
	// 拖拽组件id
	const [dragCompId, setDragCompId] = useState(null)
	// 展示组件索引
	const [dragItemComIdx, setDragItemComIdx] = useState(null)
	const [targetItemIdx, setTargetItemIdx] = useState(null)
	const [clickItemIdx, setClickItemIdx] = useState(null)
	// 配置表单
	const [form] = Form.useForm();
	// schema显示
	const [open, setOpen] = useState(false);
	
	
	/**
	 * 元拖拽事件
	 * @param e
	 * @param componentId
	 */
	const dragstart = (e, componentId) => {
		setDragCompId(componentId)
	}
	/**
	 * 元拖拽事件结束
	 */
	const dragend = () => {
		setDragCompId(null)
	}
	/**
	 * 拖拽 - 放置事件
	 */
	const handleDrop = () => {
		dragCompId && addComponent()
	}
	/**
	 * 允许拖拽元素放置在该区域
	 * @param event
	 */
	const allowDrop = event => {
		event.preventDefault(); // 允许拖拽元素放置在该区域
	}
	/**
	 * 增加组件
	 */
	const addComponent = () => {
		const data_item = mockData[dragCompId]
		if(!data_item.isTemplate) { //普通基础组件
			setData([...data, data_item])
		} else {
			setData([...data, ..._.get(data_item, 'formOptions')])
		}
	}
	
	/**
	 * 编辑问卷标题
	 * @param e
	 * @param idx
	 */
	const handleQuestionnaireTitle = (e, idx) => {
		const textContent = e?.target?.textContent;
		setQuestionnaireTitle(textContent)
	}
	/**
	 * 编辑问卷副标题
	 * @param e
	 * @param idx
	 */
	const handleQuestionnaireSubTitle = (e, idx) => {
		const textContent = e?.target?.textContent;
		setQuestionnaireSubTitle(textContent)
	}
	
	/**
	 * 拖拽展示组件
	 * @param e
	 * @param idx
	 * @param item
	 */
	const handleItemDragStart = (e, idx, item) => {
		setDragItemComIdx(idx)
	}
	/**
	 * 停止挪动展示组件为止
	 */
	const handleItemDragEnd = () => {
		setDragItemComIdx(null)
	}
	/**
	 * 展示组件进入其他展示组件区域
	 * @param idx
	 */
	const handleItemDragEnter = idx => {
		setTargetItemIdx(idx)
	}
	/**
	 * 展示组件互相移动位置
	 */
	const handleItemDrop = () => {
		if (dragCompId) return
		if (dragItemComIdx === targetItemIdx) return
		data.splice(dragItemComIdx, 1, ...data.splice(targetItemIdx, 1, data[dragItemComIdx]))
	}
	
	/**
	 * 点击
	 */
	const handleItemClick = idx => {
		setClickItemIdx(idx)
		const values = _.cloneDeep(_.get(data, `${idx}`));
		form.setFieldsValue({...values})
	}
	
	/**
	 * 编辑单个组件标题
	 */
	const handleTitle = (e, idx) => {
		const textContent = e?.target?.textContent;
		_.set(data, `${idx}.label`, textContent);
	}
	/**
	 * 多项组件 - 编辑某子项 - 编辑完成（失焦）
	 * @param e
	 * @param idx
	 * @param childIdx
	 */
	const handleChildItemCompBlur = (e, idx, childIdx) => {
		const textContent = e?.target?.textContent;
		let childOptions = _.get(data, `${idx}.options`);
		_.set(childOptions, `${childIdx}.label`, textContent)
		_.set(childOptions, `${childIdx}.value`, textContent)
		_.set(data, `${idx}.options`, childOptions);
		setData([...data])
	}
	/**
	 * 多项组件 - 删除某子项
	 * @param e
	 * @param idx
	 * @param childIdx
	 */
	const handleChildItemDelete = (e, idx, childIdx) => {
		let childOptions = _.get(data, `${idx}.options`);
		childOptions = _.filter(childOptions, (o, index) => index !== childIdx);
		_.set(data, `${idx}.options`, childOptions);
		setData([...data])
	}
	
	/**
	 * 添加子项
	 * @param e
	 * @param idx
	 */
	const addChildItem = (e, idx) => {
		let childOptions = _.get(data, `${idx}.options`);
		childOptions?.push({id: 1, label: '', value: ''},)
		_.set(data, `${idx}.options`, childOptions);
		setData([...data])
	}
	
	/**
	 * 移除当前展示组件
	 */
	const removeItem = () => {
		if (!_.isNumber(clickItemIdx)) return
		let newData = _.filter(data, (o, index) => clickItemIdx !== index)
		setData([...newData])
	}
	
	/**
	 * 显示schema数据
	 */
	const showSchema = () => {
		setOpen(true)
	}
	/**
	 * 复制item
	 */
	const copyItem = () => {
		if (!_.isNumber(clickItemIdx)) return
		let lastItem = _.last(data);
		setData([...data, lastItem])
	}
	
	/**
	 * 上移
	 */
	const moveUp = () => {
		if (!_.isNumber(clickItemIdx)) return
		if (clickItemIdx === 0) return
		let tarIdx = clickItemIdx - 1;
		data.splice(clickItemIdx, 1, ...data.splice(tarIdx, 1, data[clickItemIdx]))
		setData([...data])
	}
	
	/**
	 * 下移
	 */
	const moveDown = () => {
		if (!_.isNumber(clickItemIdx)) return
		if (clickItemIdx === data.length - 1) return
		let tarIdx = clickItemIdx + 1;
		data.splice(clickItemIdx, 1, ...data.splice(tarIdx, 1, data[clickItemIdx]))
		setData([...data])
	}
	
	/**
	 * 配置数据更新
	 * @param changedValues
	 * @param allValues
	 */
	const onValuesChange = (changedValues, allValues) => {
		if (!_.isNumber(clickItemIdx)) return
		let oldObj = _.get(data, `${clickItemIdx}`);
		let finalObj = _.assign({}, oldObj, changedValues);
		_.set(data, `${clickItemIdx}`, finalObj);
		setData([...data])
	}
	
	return (
		<div className="builder-box">
			<div className="auto-form">
				{/*操作区域*/}
				<div className="auto-form-options">
					<div className="auto-form-options-basic">
						<div className="auto-form-options-title">
							表单元件
						</div>
						<div className="auto-form-options-basic-box">
							{
								_.map(optionType?.basic, item => (
									<div key={item?.id} className="drag-handle" draggable={true}
									     onDragStart={($event) => dragstart($event, item.id)}
									     onDragEnd={($event) => dragend($event, item.id)}>
										<HeartTwoTone twoToneColor="#eb2f96"/>
										<span>{item?.label}</span>
									</div>
								))
							}
						</div>
					</div>
					<div className="auto-form-options-basic">
						{
							!_.isEmpty(optionType?.commonlyUsed) && <div className="auto-form-options-title">常用表单模版</div>
						}
						<div className="auto-form-options-basic-box">
							{
								_.map(optionType?.commonlyUsed, item => (
									<div key={item?.id} className="drag-handle" draggable={true}
									     onDragStart={($event) => dragstart($event, item.id)}
									     onDragEnd={($event) => dragend($event, item.id)}>
										<HeartTwoTone twoToneColor="#eb2f96"/>
										<span>{item?.label}</span>
									</div>
								))
							}
						</div>
					</div>
					<div className="auto-form-options-basic">
						{
							!_.isEmpty(optionType?.builtInTemplates) && <div className="auto-form-options-title">常用题库</div>
						}
						<div className="auto-form-options-basic-box">
							{
								_.map(optionType?.builtInTemplates, item => (
									<div key={item?.id} className="drag-handle" draggable={true}
									     onDragStart={($event) => dragstart($event, item.id)}
									     onDragEnd={($event) => dragend($event, item.id)}>
										<HeartTwoTone twoToneColor="#eb2f96"/>
										<span>{item?.label}</span>
									</div>
								))
							}
						</div>
					</div>
				</div>
				{/*展示区域*/}
				<div className="auto-form-workspace drag-box">
					<div className="auto-form-questionnaire" onDrop={handleDrop} onDragOver={allowDrop}>
						
						<div className="auto-form-questionnaire-wrapper">
							<Form
								labelCol={{span: 3}}
							>
								{
									data?.map((item, idx) => {
										return (
											<div key={idx}
											     className={`${clickItemIdx === idx ? 'active' : ''} auto-form-questionnaire-wrapper-item`}
											     draggable={true}
											     onDragStart={e => handleItemDragStart(e, idx, item)} onDragEnd={handleItemDragEnd}
											     onDragEnter={() => handleItemDragEnter(idx)} onDrop={handleItemDrop}
											     onClick={() => handleItemClick(idx)}>
												<BasicComponent idx={idx} item={item}/>
											</div>
										)
									})
								}
							</Form>
						</div>
					</div>
				</div>
				{/*配置区域*/}
				<div className="auto-form-setting">
					<div className="auto-form-setting-options">
						<Tooltip placement="left" title="查看schema">
							<EyeOutlined onClick={showSchema}/>
						</Tooltip>
						<Tooltip placement="left" title="复制">
							<FileTextOutlined onClick={copyItem}/>
						</Tooltip>
						<Tooltip placement="left" onClick={moveUp} title="上移">
							<ArrowUpOutlined/>
						</Tooltip>
						<Tooltip placement="left" onClick={moveDown} title="下移">
							<ArrowDownOutlined/>
						</Tooltip>
						<Tooltip placement="left" title="删除">
							<DeleteOutlined onClick={removeItem}/>
						</Tooltip>
					</div>
					<div>
						<Tabs defaultActiveKey="1" items={items}/>
						<Form
							form={form}
							labelCol={{span: 6}}
							onValuesChange={onValuesChange}
						>
							<Form.Item label="标题" name="label">
								<Input/>
							</Form.Item>
							<Form.Item label="字段名" name="name">
								<Input/>
							</Form.Item>
							<Form.Item label="默认值" name="defaultValue">
								<Input/>
							</Form.Item>
							<Form.Item label="提示文案" name="placeholder">
								<Input/>
							</Form.Item>
							{
								data?.[clickItemIdx]?.type === "select" && <Form.Item label="单选/多选" name="mode">
									<Select options={[{label: "单选", value: "单选"}, {label: "多选", value: "multiple"}, {
										label: "标签",
										value: "tags"
									}]}/>
								</Form.Item>
							}
							{
								data?.[clickItemIdx]?.type === "input" && <Form.Item label="变体" name="variant">
									<Input/>
								</Form.Item>
							}
							{
								data?.[clickItemIdx]?.type === "inputNumber" && <Form.Item label="高精度小数" name="step">
									<Input/>
								</Form.Item>
							}
							{
								data?.[clickItemIdx]?.type === "inputNumber" && <Form.Item label="前缀" name="prefix">
									<Input/>
								</Form.Item>
							}
							{
								data?.[clickItemIdx]?.type === "rate" && <Form.Item label="允许半星" name="allowHalf">
									<Select options={[{label: "是", value: true}, {label: "否", value: false}]}/>
								</Form.Item>
							}
							{
								data?.[clickItemIdx]?.type === "slider" && <Form.Item label="是否双滑块" name="range">
									<Select options={[{label: "是", value: true}, {label: "否", value: false}]}/>
								</Form.Item>
							}
							{
								data?.[clickItemIdx]?.type === "switch" && <Form.Item label="开启文字" name="checkedChildren">
									<Input/>
								</Form.Item>
							}
							{
								data?.[clickItemIdx]?.type === "switch" && <Form.Item label="关闭文字" name="unCheckedChildren">
									<Input/>
								</Form.Item>
							}
							{
								!_.isEmpty(data?.[clickItemIdx]?.options) && <Collapse
									collapsible="header"
									defaultActiveKey={['1']}
									items={[
										{
											key: '1',
											label: '选项配置',
											extra: <DownOutlined/>,
											children: <Form.List label="选项列表" name="options">
												{(fields, {add, remove}) => (
													<>
														{fields.map(({key, name, ...restField}) => (
															<Space
																key={key}
																style={{
																	display: 'flex',
																	marginBottom: 8,
																}}
																align="baseline"
															>
																<Form.Item
																	{...restField}
																	name={[name, 'label']}
																	rules={[
																		{
																			required: true,
																			message: '请填写选项标题',
																		},
																	]}
																>
																	<Input placeholder="选项标题"/>
																</Form.Item>
																<Form.Item
																	{...restField}
																	name={[name, 'value']}
																	rules={[
																		{
																			required: true,
																			message: '请填写选项值',
																		},
																	]}
																>
																	<Input placeholder="选项值"/>
																</Form.Item>
																<MinusCircleOutlined onClick={() => remove(name)}/>
															</Space>
														))}
														<Form.Item>
															<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
																添加项
															</Button>
														</Form.Item>
													</>
												)}
											</Form.List>,
										},
									]}
								/>
							}
						</Form>
					</div>
				
				</div>
			</div>
			<Drawer title="生成的schema" onClose={() => setOpen(false)} open={open} size="large">
				<JSONInput
					id='a_unique_id'
					placeholder={data}
					locale={locale}
					height="100%"
					width="100%"
				/>
			</Drawer>
		</div>
	)
}

export default Builder
