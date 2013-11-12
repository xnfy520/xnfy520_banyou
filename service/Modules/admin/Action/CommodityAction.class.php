<?php

class CommodityAction extends CommonAction {

	public function index(){
		import("@.ORG.Util.emit_ajax_page");

		$MODULE_NAME = D(MODULE_NAME);

		if(isset($_GET['category']) && $_GET['category']!=''){
			$search['category'] = $_GET['category'];
		}

		if(isset($_GET['brand']) && $_GET['brand']!=''){
			$search['brand'] = $_GET['brand'];
		}

		if(isset($_GET['query']) && !empty($_GET['query'])){
			$search['_string'] = 'title like "%'.$_GET['query'].'%" OR indexing like "%'.$_GET['query'].'%" OR name like "%'.$_GET['query'].'%"';
		}

		$counts = $MODULE_NAME->where($search)->count();

		$page = new page($counts,$_GET['limit'],$_GET['page'] ? $_GET['page'] : 0);

		$sort = 'id DESC';
		if(isset($_GET['sort'])){
			$params = json_decode(stripslashes($_GET['sort']),true);
			if(is_array($params)){
				$min_sort = array();
				for($i=0;$i<count($params);$i++){
					$min_sort[] = implode(' ', $params[$i]);
				}
			}
			$sort = implode(',', $min_sort);
		}

		$list = $MODULE_NAME->where($search)->limit($page->limit)->order($sort)->select();

		echo json_encode(array(
						"success"=>true,
						"data"=>$list,
						"total"=>$counts
					));
	}

	function getBrand(){
		$structure = F("BrandAllocationStructure");
		if($structure && isset($_GET['category'])){
			$struc = array();
			$structure = json_decode(stripslashes($structure),true);
			foreach($structure as $key=>$value){
				foreach($value['children'] as $k=>$v){
					if($v['id']==$_GET['category']){
						if(count($v['children'])>0){
							$struc = $v['children'];
						}
					}
				}
			}
			array_unshift($struc,array('id'=>0,'title'=>'全部品牌'), array('id'=>-1,'title'=>'未分配品牌'));
			echo json_encode(array(
						"success"=>true,
						"data"=>$struc
					));
		}
	}

	function insert(){
		$MODULE_NAME = D(MODULE_NAME);
		if($data = $MODULE_NAME->create()){
			$indexing_exist = $MODULE_NAME->where('indexing<>"" AND indexing="'.$_POST['indexing'].'"')->count();
			if($indexing_exist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"商品索引已经存在")
				));
				return;
			}
			$data['release_date'] = strtotime($data['release_date']);
			$data['create_date'] = time();
			if($id = $MODULE_NAME->add($data)){
				$data['id'] = $id;
				echo json_encode(array(
						"success"=>true,
						"data"=>$data
					));
			}else{
				echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"添加数据失败")
					));
			}
		}else{
			echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
		}
	}

	function getFilter(){
		if(isset($_POST['id']) && isset($_POST['indexing'])){
			$Classify = M('Classify');
			$search['id'] = $_POST['id']; //已知商品类型
			$search['index'] = $_POST['indexing']; //已知商品标识
			$where['enabled'] = 1;
			$classify = $Classify->where($search)->find();
			if($classify){
				$where['indexing'] = 'filter';
				$where['pid'] = $classify['id'];
				$where['enabled'] = 1;
				$filter = $Classify->where($where)->find();
				if($filter){
					$filter_list = $this->getByPid($filter['id']);
					if($filter_list){
						for($i=0;$i<count($filter_list);$i++){
							$filter_list[$i]['childs'] = $this->getByPid($filter_list[$i]['id']);
						}
						$structure = F("BrandAllocationStructure");
						if($structure){
							$structure = json_decode(stripslashes($structure),true);
							$struc = array();
							$struc['title'] = '品牌';
							$struc['indexing'] = 'brand';
							foreach($structure as $key=>$value){
								foreach($value['children'] as $k=>$v){
									if($v['id']==$_POST['id']){
										if(count($v['children'])>0){
											for($i=0;$i<count($v['children']);$i++){
												unset($v['children'][$i]['alias']);
											}
											$struc['childs'] = $v['children'];
										}
									}
								}
							}
							array_unshift($filter_list,$struc);
						}
						echo json_encode(array(
								"success"=>true,
								"data"=>$filter_list
							));
					}else{
						echo json_encode(array(
								"success"=>false,
								"errors"=>array("msg"=>"不存在商品筛选信息")
							));
					}
				}else{
					echo json_encode(array(
							"success"=>false,
							"errors"=>array("msg"=>"不存在商品筛选")
						));
				}
			}else{
				echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"不存在商品类型")
					));
			}
		}else{
			echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
		}
	}

	function getByPid($pid){
		$Classify = M('Classify');
		$search['enabled'] = 1;
		$search['pid'] = $pid;
		$list = $Classify->where($search)->order('sort,id')->select();
		return $list;
	}

}