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

		if(isset($_GET['master']) && !empty($_GET['master'])){
			$search['master'] = $_GET['master'];
		}

		if(isset($_GET['query']) && !empty($_GET['query'])){
			$search['_string'] = 'id like "%'.$_GET['query'].'%" OR title like "%'.$_GET['query'].'%" OR name like "%'.$_GET['query'].'%"';
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

	function getCommodity(){
		$MODULE_NAME = M(MODULE_NAME);
		if(isset($_POST['id']) && !empty($_POST['id'])){
			$data = $MODULE_NAME->find($_POST['id']);
			$classifys = json_decode($data['classifys'],true);
			if($classifys){
				$data = array_merge($data,$classifys);
			}
			if(empty($data['brand'])){
				unset($data['brand']);
			}
			if($data){
				echo json_encode(array(
						"success"=>true,
						"data"=>$data
					));
			}else{
				echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"获取数据失败")
					));
			}
		}else{
			echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
		}
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

	function getParameter(){
		$Classify = M('Classify');
		if(isset($_POST['pid']) && !empty($_POST['pid'])){
			$search['indexing'] = 'parameter';
			$search['pid'] = $_POST['pid'];
			$data = $Classify->where($search)->find();
			if($data){
				$result = $Classify->field('id,title,alias,leaf')->where('pid='.$data['id'].' AND enabled=1')->order('sort,id')->select();
				foreach($result as $key=>$value){
					$result[$key]['children'] = $Classify->field('id,title,leaf')->where('pid='.$value['id'].' AND enabled=1')->order('sort,id')->select();
					// $result[$key]['value'] = count($result[$key]['children']);
				}
				if($result){
					echo json_encode(array(
						"success"=>true,
						"data"=>$result
					));
				}
			}
		}
	}

	function insert(){
		$MODULE_NAME = D(MODULE_NAME);
		if($data = $MODULE_NAME->create()){
			$title_exist = $MODULE_NAME->where('title<>"" AND title="'.$_POST['title'].'"')->count();
            if($title_exist>0){
                    echo json_encode(array(
                            "success"=>false,
                            "errors"=>array("msg"=>"商品标题已经存在")
                    ));
                    return;
            }
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