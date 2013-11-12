<?php

class ArticleAction extends CommonAction {

	public function index(){

		import("@.ORG.Util.emit_ajax_page");

		$MODULE_NAME = D(MODULE_NAME);

		if(isset($_GET['pid']) && $_GET['pid']!=''){
			$search['pid'] = $_GET['pid'];
		}

		if(isset($_GET['query']) && !empty($_GET['query'])){
			$search['_string'] = 'title like "%'.$_GET['query'].'%" OR indexing like "%'.$_GET['query'].'%"';
		}

		if(isset($_GET['type']) && !empty($_GET['type'])){
			$search['type'] = $_GET['type'];
		}

		$counts = $MODULE_NAME->where($search)->count();

		$page = new page($counts,$_GET['limit'],$_GET['page'] ? $_GET['page'] : 0);

		// $sort = 'id DESC';

		// if(isset($_GET['sort']) && !empty($_GET['sort'])){
		// 	if(!empty($_GET['property']) && !empty($_GET['direction'])){
		// 		$sort = $_GET['propery'].' '.$_GET['direction'];
		// 	}else if(!empty($_GET['property'])){
		// 		$sort = $_GET['propery'];
		// 	}
		// }

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

	function getList(){
		if(isset($_GET['pid'])){
			$pid = is_numeric($_GET['pid']) ? $_GET['pid'] : 0;
			$MODULE_NAME = D(MODULE_NAME);
			$sort = 'id DESC';
			if(isset($_GET['sort']) && !empty($_GET['sort'])){
				if(!empty($_GET['property']) && !empty($_GET['direction'])){
					$sort = $_GET['propery'].' '.$_GET['direction'];
				}else if(!empty($_GET['property'])){
					$sort = $_GET['propery'];
				}
			}
			if(!empty($_GET['indexing'])){
				$where['indexing'] = $_GET['indexing'];
			}else{
				$where['pid'] = $pid;
			}
			$list = $MODULE_NAME->where($where)->order($sort)->select();
			echo json_encode(array(
						"success"=>true,
						"children"=>$list
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
			$release_date = $data['release_date'];
			$data['release_date'] = date('Y-m-d',$release_date);
			$data['release_time'] = date('H:i:s',$release_date);
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
			$title_exist = $MODULE_NAME->where('pid='.$_POST['pid'].' AND title="'.$_POST['title'].'"')->count();
			$indexing_exist = $MODULE_NAME->where('pid='.$_POST['pid'].' AND indexing<>"" AND indexing="'.$_POST['indexing'].'"')->count();
			if($title_exist>0 && $indexing_exist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"文章标题和文章索引在此类别中已经存在")
				));
				return;
			}else if($title_exist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"文章标题在此类别中已经存在")
				));
				return;
			}else if($indexing_exist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"文章索引在此类别中已经存在")
				));
				return;
			}
			$data['pid'] = $_POST['pid'];
			$data['release_date'] = strtotime($_POST['release_date'].' '.$_POST['release_time']);
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

	function update(){
		$MODULE_NAME = D(MODULE_NAME);
		if($data = $MODULE_NAME->create()){
			$titleexist = $MODULE_NAME->where('pid='.$_POST['pid'].' AND id<>'.$_POST['id'].' AND title="'.$_POST['title'].'"')->count();
			$nameexist = $MODULE_NAME->where('pid='.$_POST['pid'].' AND id<>'.$_POST['id'].' AND indexing<>"" AND indexing="'.$_POST['indexing'].'"')->count();
			if($titleexist>0 && $nameexist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"文章标题和文章索引在此类别中已经存在")
				));
				return;
			}else if($titleexist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"文章标题在此类别中已经存在")
				));
				return;
			}else if($nameexist>0){
				echo json_encode(array(
					"success"=>false,
					"errors"=>array("msg"=>"文章索引在此类别中已经存在")
				));
				return;
			}
			$data['release_date'] = strtotime($_POST['release_date'].' '.$_POST['release_time']);
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
				for($i=0;$i<count($ids);$i++){
					$MODULE_NAME->delete($ids[$i]);
				}
				echo json_encode(array(
						"success"=>true,
						"data"=>null
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