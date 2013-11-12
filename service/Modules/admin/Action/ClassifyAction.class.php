<?php

class ClassifyAction extends CommonAction {

	public function index(){

		import("@.ORG.Util.emit_ajax_page");

		$MODULE_NAME = D(MODULE_NAME);

		$search['pid'] = $_GET['pid'] ? $_GET['pid'] : 0;

		if(isset($_GET['query']) && !empty($_GET['query'])){
			$search['_string'] = 'title like "%'.$_GET['query'].'%" OR indexing like "%'.$_GET['query'].'%" OR remark like "%'.$_GET['query'].'%"';
		}

		$counts = $MODULE_NAME->where($search)->count();

		$page = new page($counts,$_GET['limit'],$_GET['page'] ? $_GET['page'] : 0);

		$sort = 'id DESC';

		if(isset($_GET['sort']) && !empty($_GET['sort'])){
			if(!empty($_GET['property']) && !empty($_GET['direction'])){
				$sort = $_GET['propery'].' '.$_GET['direction'];
			}else if(!empty($_GET['property'])){
				$sort = $_GET['propery'];
			}
		}

		$list = $MODULE_NAME->where($search)->limit($page->limit)->order($sort)->select();

		for($i=0;$i<count($list);$i++){
			$list[$i]['number'] = $MODULE_NAME->where('pid='.$list[$i]['id'])->count();
		}

		echo json_encode(array(
						"success"=>true,
						"data"=>$list,
						"total"=>$counts
					));
		
	}

	function getList(){
		if(isset($_GET['pid'])){
			$pid = is_numeric($_GET['pid']) ? $_GET['pid'] : 0;
			$MODULE_NAME = D(MODULE_NAME);
			$sort = 'id DESC';
			// if(isset($_GET['sort']) && !empty($_GET['sort'])){
			// 	if(!empty($_GET['property']) && !empty($_GET['direction'])){
			// 		$sort = $_GET['propery'].' '.$_GET['direction'];
			// 	}else if(!empty($_GET['property'])){
			// 		$sort = $_GET['propery'];
			// 	}
			// }
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
		
			if(!empty($_GET['indexing'])){
				$search['indexing'] = $_GET['indexing'];
				$infos = $MODULE_NAME->where($search)->find();
				if($infos){
					$where['pid'] = $infos['id'];
				}
			}else{
				$where['pid'] = $pid;
			}
			$list = $MODULE_NAME->where($where)->order($sort)->select();
			if(isset($_GET['sub'])){
				for($i=0;$i<count($list);$i++){
					$subsearch['enabled'] = 1;
					$subsearch['pid'] = $list[$i]['id'];
					$list[$i]['children'] = $MODULE_NAME->where($subsearch)->order($sort)->select();
				}
			}
			echo json_encode(array(
						"success"=>true,
						"children"=>$list,
						"pid"=>$where['pid']
					));
		}else{
			echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
		}
	}

	function getData(){
		if(isset($_POST['id']) && !empty($_POST['id'])){
			$MODULE_NAME = D(MODULE_NAME);
			$data = $MODULE_NAME->find($_POST['id']);
			echo json_encode(array(
						"success"=>true,
						"data"=>$data
					));
		}else{
			echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
		}
	}

	function insert(){
		$MODULE_NAME = D(MODULE_NAME);
		if($data = $MODULE_NAME->create()){
			// $titleexist = $MODULE_NAME->where('pid='.$_POST['pid'].' AND title="'.$_POST['title'].'"')->count();
			$nameexist = $MODULE_NAME->where('pid='.$_POST['pid'].' AND indexing<>"" AND indexing="'.$_POST['indexing'].'"')->count();
			// if($titleexist>0 && $nameexist>0){
			// 	echo json_encode(array(
			// 		"success"=>false,
			// 		"errors"=>array("msg"=>"分类名称和分类索引在此类别中已经存在")
			// 	));
			// 	return;
			// }else if($titleexist>0){
			// 	echo json_encode(array(
			// 		"success"=>false,
			// 		"errors"=>array("msg"=>"分类名称在此类别中已经存在")
			// 	));
			// 	return;
			// }else 
			if($nameexist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"分类索引在此类别中已经存在")
				));
				return;
			}
			$data['create_date'] = time();
			//每次添加都会传来$_POST['pid'] 为所创建分类的上一级
			//如果$_POST['pid']为0,则所创建分类的path为0
			//如果$_POST['pid']不为0,则查询该分类的path,所创建分类的path为父分类path+$_POST['pid']
			if($_POST['pid']!=0){
				$path = $MODULE_NAME->where('id='.$_POST['pid'])->getField('path');
				$data['path'] = $path.'-'.$_POST['pid'];
			}

			if($_POST['pid']==0){

			}
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

	function update(){
		$MODULE_NAME = D(MODULE_NAME);
		if($data = $MODULE_NAME->create()){
			$pid = $MODULE_NAME->where('id='.$_POST['id'])->getField('pid');
			// $titleexist = $MODULE_NAME->where('pid='.$pid.' AND id<>'.$_POST['id'].' AND title="'.$_POST['title'].'"')->count();
			$nameexist = $MODULE_NAME->where('pid='.$pid.' AND id<>'.$_POST['id'].' AND indexing<>"" AND indexing="'.$_POST['indexing'].'"')->count();
			// if($titleexist>0 && $nameexist>0){
			// 	echo json_encode(array(
			// 		"success"=>false,
			// 		"errors"=>array("msg"=>"分类名称和分类索引在此类别中已经存在")
			// 	));
			// 	return;
			// }else if($titleexist>0){
			// 	echo json_encode(array(
			// 		"success"=>false,
			// 		"errors"=>array("msg"=>"分类名称在此类别中已经存在")
			// 	));
			// 	return;
			// }else
			if($nameexist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"分类索引在此类别中已经存在")
				));
				return;
			}
			
			$data['modify_date'] = time();
			
			if($MODULE_NAME->save($data)){
				echo json_encode(array(
						"success"=>true,
						"data"=>$data
					));
			}else{
				echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"修改失败")
					));
			}
		}else{
			echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
		}
	}

	function delete(){
		if(isset($_POST['ids'])){
			$ids = explode(',', $_POST['ids']);
			if(count($ids)>0){
				$MODULE_NAME = D(MODULE_NAME);
				$names = array();
				$id = array();
				for($i=0;$i<count($ids);$i++){
					$count = $MODULE_NAME->where('pid='.$ids[$i])->count();
					if($count>0){
						$name = $MODULE_NAME->where('id='.$ids[$i])->getField('title');
						$names[] = $name;
					}
					else{
						$id[] = $MODULE_NAME->where('id='.$ids[$i])->getField('id');
						$MODULE_NAME->delete($ids[$i]);
					}
				}
				echo json_encode(array(
						"success"=>true,
						"data"=>array("names"=>$names,"ids"=>$id)
					));
			}else{
				echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
			}
		}else{
			echo json_encode(array(
						"success"=>false,
						"errors"=>array("msg"=>"异常操作")
					));
		}
	}

}